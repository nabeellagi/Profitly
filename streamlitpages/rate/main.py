import streamlit as st
import numpy as np
import pandas as pd
from statistics import mode, multimode
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import plotly.graph_objects as go
from collections import Counter
import re
import math

from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))


def sentiment_to_rating(score, label):
    if label == "positive":
        scaled = 6 + score * 4   # 6–10 range
    elif label == "neutral":
        scaled = 4 + (score - 0.5) * 2  # 4–6 range
    else:  # negative
        scaled = 1 + (1 - score) * 4  # 1–5 range
    return round(max(1, min(10, scaled)), 2)

# PAGE SETUP
st.set_page_config(page_title="Warung Sentiment Dashboard", page_icon="🍜", layout="centered")
st.title("Analisis Kepuasan Pelanggan")
st.markdown("Masukkan hingga *15 ulasan pelanggan* untuk mengetahui tingkat kepuasan mereka secara mudah dan visual.")

sentiment_model = pipeline(
    "sentiment-analysis",
    model="w11wo/indonesian-roberta-base-sentiment-classifier"
)

if "num_inputs" not in st.session_state:
    st.session_state.num_inputs = 1

def add_input():
    if st.session_state.num_inputs < 15:
        st.session_state.num_inputs += 1
    else:
        st.warning("⚠ Maksimum 15 ulasan sudah tercapai!")

st.header("💬 Input Ulasan Pelanggan")
comments = []
with st.form("customer_reviews"):
    for i in range(st.session_state.num_inputs):
        comment = st.text_area(f"Ulasan ke-{i+1}", height=80, key=f"comment_{i}")
        if comment.strip():
            comments.append(comment.strip())
    col1, col2 = st.columns([1, 2])
    with col1:
        st.form_submit_button("Tambah Ulasan Baru", on_click=add_input)
    with col2:
        submitted = st.form_submit_button("Analisis Semua Ulasan")

# ANALYSIs
if submitted and len(comments) > 0:
    st.header("📊 Hasil Analisis Kepuasan")

    data = []
    for text in comments:
        res = sentiment_model(text)[0]
        label = res["label"].lower()
        score = max(1e-6, min(res["score"], 1))
        rating = sentiment_to_rating(score, label)
        data.append({
            "Ulasan": text,
            "Sentimen": label.capitalize(),
            "Nilai (1-10)": rating,
            "Kepercayaan Model": round(score * 100, 2)
        })

    df = pd.DataFrame(data)
    df = df[["Ulasan", "Sentimen", "Nilai (1-10)", "Kepercayaan Model"]]

    st.subheader("📋 Tabel Hasil Ulasan")
    st.dataframe(df.style.format({
        "Kepercayaan Model": "{:.2f}%",
        "Nilai (1-10)": "{:.2f}"
    }), use_container_width=True)

    ratings = df["Nilai (1-10)"].tolist()
    avg_rating = round(np.mean(ratings), 2)
    sorted_ratings = sorted(ratings)
    q1, q2, q3 = np.percentile(sorted_ratings, [25, 50, 75])
    try:
        mode_rating = round(mode([round(r) for r in ratings]), 2)
    except:
        mode_rating = ", ".join(map(str, multimode([round(r) for r in ratings])))

    # Ringkasan cui
    st.subheader("Ringkasan Kepuasan")
    st.write(f"*Rata-rata kepuasan pelanggan:* {avg_rating}/10")
    st.write(f"*Nilai yang paling sering muncul:* {mode_rating}")
    st.write(f"*Sebagian besar pelanggan memberi nilai antara:* {q1:.2f} – {q3:.2f}")

    if avg_rating >= 8:
        st.success("Pelanggan sangat puas! Pertahankan cita rasa dan pelayanan Anda.")
    elif avg_rating >= 6:
        st.info("Pelanggan cukup puas, namun masih ada ruang untuk perbaikan.")
    else:
        st.warning("Banyak pelanggan kurang puas. Evaluasi rasa, kebersihan, dan harga produk Anda.")

    # Quartile
    st.subheader("📦 Persebaran Nilai Kepuasan")

    fig_quartile = go.Figure()

    # Background full bar
    fig_quartile.add_trace(go.Bar(
        x=[10],
        y=["Distribusi Kepuasan"],
        orientation='h',
        marker_color='rgba(220, 220, 220, 0.3)',
        hoverinfo='none',
        showlegend=False
    ))

    # Add vertical lines for Q1, Median, Q3, and Avg
    quartiles = [
        ("Q1", q1, "#63b3ed"),
        ("Median", q2, "#48bb78"),
        ("Q3", q3, "#38a169"),
        ("Rata-rata", avg_rating, "black")
    ]

    for label, value, color in quartiles:
        fig_quartile.add_shape(
            type="line",
            x0=value,
            x1=value,
            y0=-0.4,
            y1=0.4,
            line=dict(color=color, width=3, dash="dot" if label=="Rata-rata" else "solid")
        )
        fig_quartile.add_annotation(
            x=value,
            y=0,
            text=label,
            showarrow=True,
            arrowhead=2,
            ax=40,
            ay=-30
        )

    # Determine dynamic range
    min_rating = min(ratings)
    max_rating = max(ratings)
    padding = (max_rating - min_rating) * 0.1  # 10% margin
    x_min = max(1, min_rating - padding)
    x_max = min(10, max_rating + padding)

    fig_quartile.update_layout(
        xaxis=dict(
            title="Nilai Kepuasan (1–10)",
            range=[x_min, x_max],
            tickmode="linear",
            dtick=0.5
        ),
        yaxis=dict(showticklabels=False),
        template="plotly_white",
        height=300,
        margin=dict(l=30, r=30, t=40, b=30)
    )

    st.plotly_chart(fig_quartile, use_container_width=True)


    # FEEDBACK SUMMARIZER
    st.subheader("🧠 Ringkasan Feedback Otomatis")

    # Prepare textual summary for Gemini
    summary_prompt = f"""
    Kamu adalah seorang konsultan bisnis.
    Jawablah secara runtun dan jelas.
    Diberikan beberapa ulasan berikut (dalam bahasa Indonesia):

    {comments}

    Tugasmu:
    1. Sebutkan secara SINGKAT TIGA hal utama yang menjadi *kekuatan bisnis* (berdasarkan ulasan positif).
    2. Sebutkan secara SINGKAT TIGA hal utama yang menjadi *kelemahan atau masalah utama* (berdasarkan ulasan negatif).
    3. Tentukan TIGA cara terelaborasi untuk memperkuatan keunggulan dan mencegah kelemahan bisnis terjadi secara optimal:

    *Kekuatan Utama:* (isian singkat) 
    *Kelemahan Utama:* (isian singkat)

    *Saran :* (sedikit penjelasan)

    Jawab dalam format markdown terstruktur
    """

    try:
        with st.spinner("🔍 Menganalisis kekuatan dan kelemahan bisnis..."):
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=summary_prompt
            )
            summary_text = response.text.strip()

        st.markdown(summary_text)

    except Exception as e:
        st.error("Gagal menghasilkan ringkasan otomatis. Coba refresh.")
        st.exception(e)


elif submitted:
    st.warning("⚠ Silakan isi minimal satu ulasan pelanggan terlebih dahulu.")