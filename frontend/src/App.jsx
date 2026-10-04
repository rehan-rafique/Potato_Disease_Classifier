import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setPrediction(null);
  };

  const handlePredict = async () => {
    if (!image) return;

    setLoading(true);
    setPrediction(null);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      setPrediction({
        error: "Unable to connect to the prediction API.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDiseaseName = (name) => {
    if (name === "Potato___Early_blight") return "Early Blight";
    if (name === "Potato___Late_blight") return "Late Blight";
    if (name === "Potato___healthy") return "Healthy";
    return name;
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">🥔</div>
          <span>PotatoAI</span>
        </div>

        <span className="model-badge">CNN Model</span>
      </header>

      <main className="container">
        <section className="hero">
          <span className="eyebrow">AI-POWERED PLANT ANALYSIS</span>

          <h1>
            Detect potato diseases with
            <span> AI</span>.
          </h1>

          <p>
            Upload a potato leaf image and let our CNN model identify whether it
            is healthy or affected by disease.
          </p>
        </section>

        <section className="card">
          {!preview ? (
            <label className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              <div className="upload-icon">↑</div>

              <h2>Upload a leaf image</h2>

              <p>
                Drag and drop your image here or <strong>browse files</strong>
              </p>

              <small>PNG, JPG or JPEG</small>
            </label>
          ) : (
            <div className="preview-section">
              <div className="image-wrapper">
                <img src={preview} alt="Potato leaf" />
              </div>

              <div className="file-info">
                <div>
                  <h3>{image.name}</h3>
                  <p>{(image.size / 1024).toFixed(1)} KB</p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                    setPrediction(null);
                  }}
                >
                  Remove
                </button>
              </div>

              <button
                className="predict-btn"
                onClick={handlePredict}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>Analyze Leaf →</>
                )}
              </button>
            </div>
          )}

          {prediction && !prediction.error && (
            <div className="result">
              <div className="result-header">
                <span className="result-label">PREDICTION</span>
                <span className="check">✓</span>
              </div>

              <h2>{getDiseaseName(prediction.class)}</h2>

              <div className="confidence">
                <div className="confidence-top">
                  <span>Confidence</span>
                  <strong>{(prediction.confidence * 100).toFixed(2)}%</strong>
                </div>

                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${prediction.confidence * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {prediction?.error && (
            <div className="error">
              <strong>Prediction failed</strong>
              <p>{prediction.error}</p>
            </div>
          )}
        </section>

        <section className="supported">
          <p>MODEL CAN DETECT</p>

          <div className="diseases">
            <span>● Early Blight</span>
            <span>● Late Blight</span>
            <span>● Healthy</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
