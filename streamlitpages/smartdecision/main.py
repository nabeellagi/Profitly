import streamlit as st
import numpy as np
from scipy import stats
from dotenv import load_dotenv
import os
from google import genai

# Load API key
load_dotenv()
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

st.set_page_config(page_title="SmartDecision Lab - Dari Profitly", page_icon="📊", layout="centered")

st.title("SmartDecision Lab - Dari Profitly")
st.write("""
Selamat datang di **SmartDecision Lab**, tempatmu bereksperimen dengan keputusan bisnis kecilmu.
Aplikasi ini membantu kamu memahami apakah keputusan seperti diskon, promosi, atau strategi baru 
benar-benar berpengaruh pada penjualanmu — dengan cara yang mudah dan terarah.
""")

st.divider()

# Step 0: Input Faktor
factor = st.text_input("Masukkan faktor yang ingin diuji (contoh: Diskon 10%, Kemasan Baru, Iklan TikTok):", "")

if factor:
    # number of days
    num_days = 14

    # Initialize persistent storage for analysis
    if "t_test_result" not in st.session_state:
        st.session_state.t_test_result = ""
    if "analysis_text" not in st.session_state:
        st.session_state.analysis_text = ""
    if "corr_result" not in st.session_state:
        st.session_state.corr_result = ""

    # Step 1: T-Test Section
    st.subheader(f"Langkah 1: Bandingkan Sebelum dan Sesudah '{factor}'")
    st.write(f"Masukkan data penjualan harian selama {num_days} hari sebelum dan sesudah perubahan dilakukan:")

    with st.expander("Input Data Penjualan Harian"):
        col1, col2 = st.columns(2)
        before, after = [], []

        with col1:
            st.markdown(f"**{num_days} Hari Sebelum Perubahan**")
            for i in range(1, num_days + 1):
                val = st.number_input(f"Hari {i} Sebelum", min_value=0, step=1000, key=f"before_{i}")
                before.append(val)
                if val > 0:
                    st.caption(f"💰 Rp {val:,.0f}".replace(",", "."))

        with col2:
            st.markdown(f"**{num_days} Hari Sesudah Perubahan**")
            for i in range(1, num_days + 1):
                val = st.number_input(f"Hari {i} Sesudah", min_value=0, step=1000, key=f"after_{i}")
                after.append(val)
                if val > 0:
                    st.caption(f"💰 Rp {val:,.0f}".replace(",", "."))

    before = np.array(before)
    after = np.array(after)

    if st.button("Analisis Perubahan"):
        if np.count_nonzero(before) == num_days and np.count_nonzero(after) == num_days:
            t_stat, p_val = stats.ttest_rel(after, before)
            mean_before, mean_after = np.mean(before), np.mean(after)
            change = mean_after - mean_before

            summary = (
                f"Rata-rata Sebelum: Rp {mean_before:,.0f} | "
                f"Rata-rata Sesudah: Rp {mean_after:,.0f} | "
                f"T-stat: {t_stat:.3f}, p-value: {p_val:.4f}"
            )

            st.session_state.t_test_result = summary
            st.success("Hasil Analisis T-Test")
            st.write(summary.replace(",", "."))

            analysis_text = ""
            if p_val < 0.05:
                if change > 0:
                    st.markdown(f"### ✅ Ada peningkatan signifikan setelah penerapan **{factor}** (p-value = {p_val:.4f}).")
                    st.markdown("Perubahan ini kemungkinan besar berdampak positif.")
                    analysis_text += f"Hasil menunjukkan peningkatan signifikan pada penjualan setelah penerapan {factor}. "
                else:
                    st.markdown(f"### ⚠️ Ada penurunan signifikan setelah penerapan **{factor}** (p-value = {p_val:.4f}).")
                    st.markdown("Keputusan ini mungkin perlu dievaluasi kembali.")
                    analysis_text += f"Hasil menunjukkan penurunan signifikan pada penjualan setelah penerapan {factor}. "
            else:
                st.info(f"Tidak ada perubahan signifikan (p-value = {p_val:.4f}).")
                st.markdown("Perubahan kemungkinan hanya akibat variasi harian biasa.")
                analysis_text += f"Tidak ada perubahan signifikan pada data sebelum dan sesudah {factor}. "

            st.session_state.analysis_text = analysis_text
        else:
            st.error(f"Pastikan semua {num_days} data sebelum dan sesudah telah diisi dengan benar.")

    # Show last result if available
    if st.session_state.t_test_result:
        st.info(f"Terakhir: {st.session_state.t_test_result}")

    st.divider()

    # Step 2: Korelasi Section, Pearson
    st.subheader(f"Langkah 2: Analisis Korelasi '{factor}'")
    st.write("""
Jika dapat diukur, masukkan berapa kali kamu melakukan faktor tersebut setiap hari 
dan total penjualan harian.
""")

    with st.expander("Input Data Korelasi"):
        col3, col4 = st.columns(2)
        x_data, y_data = [], []

        with col3:
            st.markdown("**Jumlah Aktivitas per Hari (X)**")
            for i in range(1, num_days + 1):
                val = st.number_input(f"Hari {i} - Aktivitas", min_value=0, step=1, key=f"x_{i}")
                x_data.append(val)
                if val > 0:
                    st.caption(f"{val:,.0f} {factor}".replace(",", "."))

        with col4:
            st.markdown("**Total Penjualan per Hari (Y)**")
            for i in range(1, num_days + 1):
                val = st.number_input(f"Hari {i} - Penjualan", min_value=0, step=1000, key=f"y_{i}")
                y_data.append(val)
                if val > 0:
                    st.caption(f"💰 Rp {val:,.0f}".replace(",", "."))

    x_data = np.array(x_data)
    y_data = np.array(y_data)

    if st.button("Analisis Korelasi"):
        if len(x_data) == len(y_data) and np.count_nonzero(y_data) >= 5:
            corr, p_corr = stats.pearsonr(x_data, y_data)
            st.success("Hasil Analisis Korelasi")
            st.write(f"Nilai Korelasi (r): **{corr:.3f}**")

            analysis_text = st.session_state.analysis_text
            if corr > 0.5:
                st.markdown("### Hubungan kuat dan positif: semakin sering faktor dilakukan, penjualan meningkat.")
                analysis_text += f"Terdapat hubungan positif yang kuat (r={corr:.3f}) antara intensitas {factor} dan penjualan. "
            elif corr < -0.5:
                st.markdown("### Hubungan kuat tapi negatif: semakin sering faktor dilakukan, penjualan menurun.")
                analysis_text += f"Terdapat hubungan negatif yang kuat (r={corr:.3f}) antara intensitas {factor} dan penjualan. "
            else:
                st.markdown("### Hubungan lemah atau tidak pasti antara faktor tersebut dan penjualan.")
                analysis_text += f"Tidak ditemukan hubungan kuat (r={corr:.3f}) antara {factor} dan penjualan. "

            st.session_state.corr_result = f"Korelasi: {corr:.3f}, p-value: {p_corr:.4f}"
            st.session_state.analysis_text = analysis_text
        else:
            st.error(f"Pastikan jumlah data X dan Y sama dan minimal 5 dari {num_days} hari terisi.")

    if st.session_state.corr_result:
        st.info(f"Terakhir: {st.session_state.corr_result}")

    st.divider()

    # Step 3: Gemini Insight Button
    if st.button("Analisis Insight Otomatis (Gemini)"):
        combined_summary = (
            f"Faktor: {factor}. "
            f"Hasil T-Test: {st.session_state.t_test_result}. "
            f"Hasil Korelasi: {st.session_state.corr_result}. "
            f"{st.session_state.analysis_text}"
        )

        prompt = f"""
        Kamu adalah analis bisnis profesional. Jelaskan hasil berikut dalam bahasa Indonesia yang mudah dipahami.
        Data: {combined_summary}

        Berikan:
        1. Ringkasan hasil analisis (arti bisnisnya secara sederhana).
        2. Tiga kemungkinan penyebab hasil tersebut.
        3. Tiga saran praktis untuk memperbaiki atau memaksimalkan hasil dari '{factor}'.
        Gunakan format markdown yang rapi.
        """

        try:
            with st.spinner("Gemini sedang menganalisis hasil..."):
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                st.markdown(response.text)
        except Exception as e:
            st.error("Gagal menghasilkan insight otomatis.")
            st.exception(e)
