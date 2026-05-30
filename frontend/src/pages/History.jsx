import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function History() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get("/api/resume/history");
      setReports(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page-card glass">
      <h1 className="hero-title" style={{ fontSize: 42 }}>
        History
      </h1>

      <div className="history-grid">
        {reports.map((item) => (
          <Link
            key={item._id}
            to={`/report/${item._id}`}
            className="history-card"
          >
            <h3>{item.fileName}</h3>
            <p>ATS Score: {item.atsScore}</p>
            <span>{item.overallLevel}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}