import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";
import res from "./res.jpg";

// ----------------- Header Component -----------------
const Header = () => (
  <header style={{
    backgroundColor: "#001f3f",
    color: "white",
    padding: "1rem",
    fontSize: "1.6rem",
    textAlign: "center",
    fontWeight: "bold"
  }}>
    AI-Powered Resume Builder
  </header>
);

// ----------------- Footer Component -----------------
const Footer = () => (
  <footer style={{
    backgroundColor: "#001f3f",
    color: "#f1f1f1",
    fontSize: "15px",
    padding: "15px 0",
    textAlign: "center"
  }}>
    Designed by Kartik ·
    <a href="https://www.instagram.com/kartikghuge04/" style={{ color: "#e1306c", margin: "0 10px" }} target="_blank" rel="noreferrer">Instagram</a>
    <a href="mailto:kartikghuge2004@gmail.com" style={{ color: "#00acee", margin: "0 10px" }}>Email</a>
    <a href="https://www.linkedin.com/in/kartik-ghuge-755945331/" style={{ color: "#0e76a8", margin: "0 10px" }} target="_blank" rel="noreferrer">LinkedIn</a>
  </footer>
);

// ----------------- Home Page -----------------
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div
        style={{
          backgroundImage: `url(${res})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "calc(100vh - 150px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ marginBottom: "1rem", color: "black" }}>
            <strong>Free & AI-powered Resume Builder</strong>
          </h1>
          <button
            onClick={() => navigate("/build")}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.2rem",
              background: "#007bff",
              border: "none",
              borderRadius: "5px",
              color: "white",
              cursor: "pointer"
            }}
          >
            Start Building Resume
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

// ----------------- Resume Builder -----------------
const ResumeForm = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", contact: "",
    school: "", schoolDuration: "", schoolPercentage: "",
    college: "", collegeDuration: "", collegePercentage: "",
    degree: "", degreeDuration: "", degreeCGPA: "",
    projects: "", certificates: "", linkedin: "", experience: ""
  });

  const [step, setStep] = useState(1);
  const [aiData, setAiData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/resume", formData);
      setAiData(res.data);
      setStep(4);
    } catch (err) {
      console.error(err);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20).text(formData.name, 20, 20);
    doc.setFontSize(11).text(`Email: ${formData.email}`, 20, 30);
    doc.text(`Phone: ${formData.contact}`, 20, 36);
    if (formData.linkedin) doc.text(`LinkedIn: ${formData.linkedin}`, 20, 42);

    let y = 55;
    const section = (title, content) => {
      if (content) {
        doc.setFontSize(14).setTextColor(0, 0, 128).text(title, 20, y);
        y += 7;
        doc.setFontSize(11).setTextColor(50);
        const lines = doc.splitTextToSize(content, 170);
        doc.text(lines, 20, y);
        y += lines.length * 6 + 4;
      }
    };

    section("Professional Summary", aiData?.summary);
    section("Skills", aiData?.skills?.join(", "));
    section("Technologies", aiData?.technologies?.join(", "));
    section("Experience", formData.experience);
    section("Projects", aiData?.projects || formData.projects);
    section("Certificates", aiData?.certificates || formData.certificates);

    const edu = Array.isArray(aiData?.education) ? aiData.education : [];
    const educationText = edu.length
      ? edu.map(ed => `${ed.qualification} - ${ed.institution} (${ed.duration}) – ${ed.score}`).join("\n")
      : "No education data available";
    section("Education", educationText);

    doc.save("resume.pdf");
  };

  const inputStyle = {
    width: "100%", padding: "10px", marginBottom: "10px",
    borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px"
  };

  const buttonStyle = {
    padding: "10px 20px", margin: "10px 5px", fontSize: "16px",
    backgroundColor: "#007bff", color: "white", border: "none",
    borderRadius: "4px", cursor: "pointer"
  };

  const boxStyle = {
    flex: "1", minWidth: "300px", maxWidth: "600px",
    backgroundColor: darkMode ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.9)",
    padding: "30px", borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    color: darkMode ? "#fff" : "#000",
    transition: "all 0.3s ease"
  };

  const renderPreview = () => (
    <div style={{ ...boxStyle, flex: "1.2" }}>
      <h2 style={{ textAlign: "center" }}>Live Preview</h2>
      <p><strong>Name:</strong> {formData.name}</p>
      <p><strong>Email:</strong> {formData.email}</p>
      <p><strong>Phone:</strong> {formData.contact}</p>
      {formData.linkedin && <p><strong>LinkedIn:</strong> {formData.linkedin}</p>}
      <hr />
      {formData.experience && <><h3>Experience</h3><p>{formData.experience}</p></>}
      {formData.projects && <><h3>Projects</h3><p>{formData.projects}</p></>}
      {formData.certificates && <><h3>Certificates</h3><p>{formData.certificates}</p></>}
      <h3>Education</h3>
      <ul>
        <li>{formData.school} ({formData.schoolDuration}) – {formData.schoolPercentage}%</li>
        <li>{formData.college} ({formData.collegeDuration}) – {formData.collegePercentage}%</li>
        <li>{formData.degree} ({formData.degreeDuration}) – {formData.degreeCGPA} CGPA</li>
      </ul>
    </div>
  );

  const renderForm = () => (
    <div style={boxStyle}>
      {step === 1 && (
        <>
          <h2>Personal Info</h2>
          <input style={inputStyle} name="name" placeholder="Name" onChange={handleChange} />
          <input style={inputStyle} name="email" placeholder="Email" onChange={handleChange} />
          <input style={inputStyle} name="contact" placeholder="Contact Number" onChange={handleChange} />
          <button style={buttonStyle} onClick={nextStep}>Next</button>
        </>
      )}
      {step === 2 && (
        <>
          <h2>Education Info</h2>
          <input style={inputStyle} name="school" placeholder="School Name" onChange={handleChange} />
          <input style={inputStyle} name="schoolPercentage" placeholder="Percentage" onChange={handleChange} />
          <input style={inputStyle} name="schoolDuration" placeholder="Duration" onChange={handleChange} />
          <input style={inputStyle} name="college" placeholder="College Name" onChange={handleChange} />
          <input style={inputStyle} name="collegePercentage" placeholder="Percentage" onChange={handleChange} />
          <input style={inputStyle} name="collegeDuration" placeholder="Duration" onChange={handleChange} />
          <input style={inputStyle} name="degree" placeholder="Degree" onChange={handleChange} />
          <input style={inputStyle} name="degreeCGPA" placeholder="CGPA" onChange={handleChange} />
          <input style={inputStyle} name="degreeDuration" placeholder="Duration" onChange={handleChange} />
          <div>
            <button style={buttonStyle} onClick={prevStep}>Back</button>
            <button style={buttonStyle} onClick={nextStep}>Next</button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <h2>Optional Info</h2>
          <textarea style={inputStyle} name="projects" placeholder="Projects" onChange={handleChange} />
          <textarea style={inputStyle} name="certificates" placeholder="Certificates" onChange={handleChange} />
          <input style={inputStyle} name="linkedin" placeholder="LinkedIn URL" onChange={handleChange} />
          <textarea style={inputStyle} name="experience" placeholder="Experience" onChange={handleChange} />
          <div>
            <button style={buttonStyle} onClick={prevStep}>Back</button>
            <button style={buttonStyle} onClick={handleSubmit}>Submit</button>
          </div>
        </>
      )}
      {step === 4 && aiData && (
        <>
          <h2>AI Enhanced Resume</h2>
          <p><strong>Summary:</strong> {aiData?.summary}</p>
          <p><strong>Skills:</strong> {aiData?.skills?.join(", ")}</p>
          <p><strong>Technologies:</strong> {aiData?.technologies?.join(", ")}</p>
          <button style={buttonStyle} onClick={generatePDF}>Download PDF</button>
        </>
      )}
    </div>
  );

  return (
    <>
      <Header />
      <main style={{
        backgroundImage: `url(${res})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "calc(100vh - 150px)",
        padding: "40px 20px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 style={{ color: darkMode ? "#fff" : "#000" }}>Build Your Resume</h1>
          <button onClick={toggleDarkMode} style={buttonStyle}>
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", justifyContent: "center" }}>
          {renderForm()}
          {step < 4 && renderPreview()}
        </div>
      </main>
      <Footer />
    </>
  );
};

// ----------------- App Router -----------------
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/build" element={<ResumeForm />} />
      </Routes>
    </Router>
  );
};

export default App;
