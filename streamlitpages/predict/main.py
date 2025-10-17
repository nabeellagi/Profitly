import streamlit as st
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
import plotly.graph_objects as go
import math

st.set_page_config(page_title="Prediksi Penjualan Warung", page_icon="🍛", layout="centered")

st.title("Prediksi & Rekomendasi Penjualan - Profitly")
st.markdown("""
Unggah file **CSV** dengan format dari unduhan Dashboard
""")

# FILE UPLOAD
uploaded_file = st.file_uploader("📂 Unggah File CSV Penjualan", type=["csv"])

if uploaded_file is not None:
    try:
        df = pd.read_csv(uploaded_file)
        if "Hari" not in df.columns or "Jumlah Terjual" not in df.columns:
            st.error("❌ Format CSV tidak sesuai. Pastikan kolom 'Hari' dan 'Jumlah Terjual' ada.")
        else:
            # Convert "Day X" to number
            df["Hari_Num"] = df["Hari"].str.extract(r"(\d+)").astype(int)

            unique_days = df["Hari_Num"].nunique()
            if unique_days <= 2:
                st.warning("⚠️ Data harus memiliki lebih dari 2 hari agar prediksi bisa dilakukan.")
            else:
                # Regression type selection
                regression_type = "Linear" if unique_days <= 4 else "Polynomial"
                st.success(f"✅ Data berhasil dimuat! Menggunakan **{regression_type} Regression**.")

                st.subheader("📋 Data Penjualan")
                st.dataframe(df, use_container_width=True)

                st.markdown("---")
                st.header("📈 Prediksi Penjualan per Barang (2 Hari ke Depan)")

                predictions = []
                fig = go.Figure()

                # Loop per item
                for item in df["Barang"].unique():
                    item_df = df[df["Barang"] == item]
                    X = item_df[["Hari_Num"]]
                    y = item_df["Jumlah Terjual"]

                    # Choose regression model
                    if regression_type == "Linear":
                        # Linear
                        model = LinearRegression()
                        model.fit(X, y)
                        predict_func = lambda x: model.predict(x)
                    else:
                        # Polynomial regression
                        poly = PolynomialFeatures(degree=2)
                        X_poly = poly.fit_transform(X)
                        model = LinearRegression()
                        model.fit(X_poly, y)
                        predict_func = lambda x: model.predict(poly.transform(x))

                    # Generate predictions 2 days
                    future_days = np.array([max(df["Hari_Num"]) + 1, max(df["Hari_Num"]) + 2]).reshape(-1, 1)
                    predicted_sales = [max(0, math.floor(p)) for p in predict_func(future_days)]

                    # Assign consistent color
                    color = f"hsl({hash(item) % 360}, 70%, 50%)"

                    # Save for summary
                    for day, pred in zip(future_days.flatten(), predicted_sales):
                        predictions.append({
                            "Barang": item,
                            "Hari": f"Day {int(day)}",
                            "Prediksi Terjual": round(pred, 2)
                        })

                    # Plot actual line
                    fig.add_trace(go.Scatter(
                        x=item_df["Hari_Num"],
                        y=item_df["Jumlah Terjual"],
                        mode='lines+markers',
                        name=f"{item} (Aktual)",
                        line=dict(color=color, width=3)
                    ))

                    # Plot predicted line 
                    fig.add_trace(go.Scatter(
                        x=future_days.flatten(),
                        y=predicted_sales,
                        mode='lines+markers',
                        name=f"{item} (Prediksi)",
                        line=dict(color=color, dash='dot', width=2)
                    ))

                # Plot settings
                fig.update_layout(
                    title=f"Prediksi Penjualan per Barang ({regression_type} Regression)",
                    xaxis_title="Hari",
                    yaxis_title="Jumlah Terjual",
                    template="plotly_white",
                    height=500
                )
                st.plotly_chart(fig, use_container_width=True)

                # TABEL PREDIKSI CUI
                pred_df = pd.DataFrame(predictions)[["Hari", "Barang", "Prediksi Terjual"]]

                day_plus1 = pred_df[pred_df["Hari"].str.contains(f"Day {max(df['Hari_Num']) + 1}")]
                day_plus2 = pred_df[pred_df["Hari"].str.contains(f"Day {max(df['Hari_Num']) + 2}")]

                st.subheader(f"📅 Prediksi Penjualan Hari Berikutnya (Day {max(df['Hari_Num']) + 1})")
                st.dataframe(day_plus1, use_container_width=True)

                st.subheader(f"📅 Prediksi Penjualan 2 Hari Lagi (Day {max(df['Hari_Num']) + 2})")
                st.dataframe(day_plus2, use_container_width=True)

                st.markdown("---")
                st.header("Analisis & Rekomendasi")

                # Find top and bottom performers
                avg_sales = df.groupby("Barang")["Jumlah Terjual"].mean().sort_values(ascending=False)
                top_items = avg_sales.head(2).index.tolist()
                low_items = avg_sales.tail(2).index.tolist()

                st.write("**2 Barang dengan Penjualan Tertinggi:**")
                st.success(", ".join(top_items))

                st.write("**2 Barang dengan Penjualan Terendah:**")
                st.warning(", ".join(low_items))

                # Smart discount recommendations
                st.subheader("Rekomendasi Diskon")
                st.markdown("""
Rekomendasi dibuat berdasarkan tren penjualan:
- Barang dengan **penjualan tinggi** bisa diberi diskon kecil untuk menarik lebih banyak pelanggan.
- Barang dengan **penjualan rendah** bisa diberi diskon lebih besar agar stok cepat berputar.
""")

                discount_suggestions = []
                for item in top_items:
                    discount_suggestions.append({
                        "Barang": item,
                        "Tipe Rekomendasi": "Penjualan Tinggi",
                        "Saran Diskon": "Diskon ringan (5-10%) untuk menarik loyalitas pelanggan."
                    })
                for item in low_items:
                    discount_suggestions.append({
                        "Barang": item,
                        "Tipe Rekomendasi": "Penjualan Rendah",
                        "Saran Diskon": "Diskon besar (15-25%) agar penjualan meningkat."
                    })

                st.dataframe(pd.DataFrame(discount_suggestions), use_container_width=True)
                st.markdown("✨ _Gunakan prediksi dan rekomendasi ini untuk menyesuaikan strategi penjualan Anda agar semakin menguntungkan!_")

    except Exception as e:
        st.error(f"Terjadi kesalahan saat memproses file: {e}")

else:
    st.info("Silakan unggah file CSV untuk memulai analisis.")
