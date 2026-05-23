import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, ScatterChart, Scatter, LineChart, Line, CartesianGrid, Legend, Cell } from "recharts";

// ─── EMBEDDED DATA ──────────────────────────────────────────────────────────
const DATA = {
  summary: { total_revenue: 2173125.10, total_enrollments: 10000, avg_course_price: 234.18, avg_course_rating: 3.72, n_courses: 60, n_teachers: 60, n_transactions: 10000 },
  model_results: [
    { model: "Linear Regression", target: "Enrollment", MAE: 10.64, RMSE: 13.44, R2: -0.5475 },
    { model: "Ridge", target: "Enrollment", MAE: 9.43, RMSE: 11.98, R2: -0.2297 },
    { model: "Lasso", target: "Enrollment", MAE: 10.02, RMSE: 12.82, R2: -0.4074 },
    { model: "Random Forest", target: "Enrollment", MAE: 9.98, RMSE: 11.97, R2: -0.2271 },
    { model: "Gradient Boosting", target: "Enrollment", MAE: 8.89, RMSE: 11.50, R2: -0.1327 },
    { model: "Linear Regression", target: "Revenue", MAE: 2455.63, RMSE: 3650.88, R2: 0.9607 },
    { model: "Ridge", target: "Revenue", MAE: 2017.10, RMSE: 3047.95, R2: 0.9726 },
    { model: "Lasso", target: "Revenue", MAE: 2454.65, RMSE: 3650.03, R2: 0.9607 },
    { model: "Random Forest", target: "Revenue", MAE: 2650.54, RMSE: 3511.77, R2: 0.9636 },
    { model: "Gradient Boosting", target: "Revenue", MAE: 2439.60, RMSE: 2862.46, R2: 0.9758 },
  ],
  feature_importance_enrollment: { CoursePrice: 0.2517, CourseDuration: 0.2299, YearsOfExperience: 0.1159, CourseCategory: 0.0777, TeacherRating: 0.0921, CourseRating: 0.0754, CourseLevel: 0.0536, RatingTier: 0.0234, DurationBucket: 0.0191, PriceBand: 0.0163, CourseType: 0.0272, ExpertiseMatch: 0.0082, ExperienceBucket: 0.0097 },
  feature_importance_revenue: { CoursePrice: 0.7491, PriceBand: 0.2222, CourseRating: 0.0148, TeacherRating: 0.0029, YearsOfExperience: 0.0026, CourseCategory: 0.0023, CourseType: 0.0018, CourseDuration: 0.0018, ExperienceBucket: 0.0007, RatingTier: 0.0010, CourseLevel: 0.0003, DurationBucket: 0.0004, ExpertiseMatch: 0.0000 },
  category_revenue: [
    { CourseCategory: "Finance", TotalRevenue: 316039, TotalEnrollments: 1178, AvgCoursePrice: 298.9, CourseCount: 7 },
    { CourseCategory: "Music", TotalRevenue: 281442, TotalEnrollments: 1330, AvgCoursePrice: 227.5, CourseCount: 8 },
    { CourseCategory: "Design", TotalRevenue: 277624, TotalEnrollments: 990, AvgCoursePrice: 293.8, CourseCount: 6 },
    { CourseCategory: "Photography", TotalRevenue: 269652, TotalEnrollments: 1144, AvgCoursePrice: 246.8, CourseCount: 7 },
    { CourseCategory: "Marketing", TotalRevenue: 247706, TotalEnrollments: 1507, AvgCoursePrice: 171.1, CourseCount: 9 },
    { CourseCategory: "Health", TotalRevenue: 245781, TotalEnrollments: 979, AvgCoursePrice: 274.4, CourseCount: 6 },
    { CourseCategory: "Technology", TotalRevenue: 173069, TotalEnrollments: 1344, AvgCoursePrice: 136.9, CourseCount: 8 },
    { CourseCategory: "Business", TotalRevenue: 157493, TotalEnrollments: 506, AvgCoursePrice: 343.4, CourseCount: 3 },
    { CourseCategory: "Language", TotalRevenue: 132793, TotalEnrollments: 672, AvgCoursePrice: 223.7, CourseCount: 4 },
    { CourseCategory: "Data Science", TotalRevenue: 71527, TotalEnrollments: 350, AvgCoursePrice: 220.8, CourseCount: 2 },
  ],
  top_courses: [
    { CourseName: "Course_9", CourseCategory: "Marketing", CoursePrice: 493.99, CourseRating: 4.5, EnrollmentCount: 199, TotalRevenue: 90879 },
    { CourseName: "Course_16", CourseCategory: "Design", CoursePrice: 497.85, CourseRating: 4.9, EnrollmentCount: 190, TotalRevenue: 87361 },
    { CourseName: "Course_35", CourseCategory: "Photography", CoursePrice: 453.70, CourseRating: 4.2, EnrollmentCount: 184, TotalRevenue: 77328 },
    { CourseName: "Course_44", CourseCategory: "Health", CoursePrice: 468.33, CourseRating: 3.9, EnrollmentCount: 164, TotalRevenue: 70944 },
    { CourseName: "Course_3", CourseCategory: "Photography", CoursePrice: 458.73, CourseRating: 2.6, EnrollmentCount: 166, TotalRevenue: 70457 },
    { CourseName: "Course_23", CourseCategory: "Finance", CoursePrice: 438.19, CourseRating: 3.0, EnrollmentCount: 173, TotalRevenue: 70147 },
    { CourseName: "Course_18", CourseCategory: "Health", CoursePrice: 448.57, CourseRating: 3.7, EnrollmentCount: 163, TotalRevenue: 67564 },
    { CourseName: "Course_49", CourseCategory: "Finance", CoursePrice: 434.47, CourseRating: 3.3, EnrollmentCount: 164, TotalRevenue: 65586 },
    { CourseName: "Course_2", CourseCategory: "Design", CoursePrice: 397.78, CourseRating: 2.9, EnrollmentCount: 177, TotalRevenue: 65243 },
    { CourseName: "Course_55", CourseCategory: "Business", CoursePrice: 411.60, CourseRating: 3.1, EnrollmentCount: 170, TotalRevenue: 64858 },
  ],
  course_data: [
    { CourseName: "Course_0", CourseCategory: "Marketing", CourseType: "Video", CourseLevel: "Beginner", CoursePrice: 108.37, CourseRating: 2.8, CourseDuration: 22.2, EnrollmentCount: 183, TotalRevenue: 18387, PriceBand: "Medium", RatingTier: "Low" },
    { CourseName: "Course_1", CourseCategory: "Photography", CourseType: "Live", CourseLevel: "Intermediate", CoursePrice: 164.35, CourseRating: 3.7, CourseDuration: 15.6, EnrollmentCount: 162, TotalRevenue: 24457, PriceBand: "High", RatingTier: "Average" },
    { CourseName: "Course_2", CourseCategory: "Design", CourseType: "Live", CourseLevel: "Intermediate", CoursePrice: 397.78, CourseRating: 2.9, CourseDuration: 25.4, EnrollmentCount: 177, TotalRevenue: 65243, PriceBand: "Premium", RatingTier: "Low" },
    { CourseName: "Course_3", CourseCategory: "Photography", CourseType: "Video", CourseLevel: "Beginner", CoursePrice: 458.73, CourseRating: 2.6, CourseDuration: 1.5, EnrollmentCount: 166, TotalRevenue: 70457, PriceBand: "Premium", RatingTier: "Low" },
    { CourseName: "Course_4", CourseCategory: "Health", CourseType: "Live", CourseLevel: "Intermediate", CoursePrice: 186.29, CourseRating: 4.0, CourseDuration: 6.6, EnrollmentCount: 163, TotalRevenue: 28117, PriceBand: "High", RatingTier: "Average" },
    { CourseName: "Course_5", CourseCategory: "Finance", CourseType: "Video", CourseLevel: "Beginner", CoursePrice: 160.41, CourseRating: 3.0, CourseDuration: 29.9, EnrollmentCount: 162, TotalRevenue: 24120, PriceBand: "High", RatingTier: "Low" },
    { CourseName: "Course_6", CourseCategory: "Marketing", CourseType: "Hybrid", CourseLevel: "Advanced", CoursePrice: 105.64, CourseRating: 4.0, CourseDuration: 10.5, EnrollmentCount: 168, TotalRevenue: 16393, PriceBand: "Medium", RatingTier: "Average" },
    { CourseName: "Course_7", CourseCategory: "Music", CourseType: "Video", CourseLevel: "Intermediate", CoursePrice: 342.45, CourseRating: 2.8, CourseDuration: 24.3, EnrollmentCount: 173, TotalRevenue: 54852, PriceBand: "Premium", RatingTier: "Low" },
    { CourseName: "Course_8", CourseCategory: "Technology", CourseType: "Hybrid", CourseLevel: "Beginner", CoursePrice: 168.31, CourseRating: 3.3, CourseDuration: 16.0, EnrollmentCount: 178, TotalRevenue: 27641, PriceBand: "High", RatingTier: "Average" },
    { CourseName: "Course_9", CourseCategory: "Marketing", CourseType: "Video", CourseLevel: "Beginner", CoursePrice: 493.99, CourseRating: 4.5, CourseDuration: 34.3, EnrollmentCount: 199, TotalRevenue: 90879, PriceBand: "Premium", RatingTier: "Good" },
    { CourseName: "Course_10", CourseCategory: "Marketing", CourseType: "Live", CourseLevel: "Beginner", CoursePrice: 59.80, CourseRating: 3.2, CourseDuration: 8.1, EnrollmentCount: 175, TotalRevenue: 9650, PriceBand: "Medium", RatingTier: "Average" },
    { CourseName: "Course_11", CourseCategory: "Music", CourseType: "Video", CourseLevel: "Beginner", CoursePrice: 21.50, CourseRating: 4.1, CourseDuration: 14.2, EnrollmentCount: 180, TotalRevenue: 3590, PriceBand: "Low", RatingTier: "Good" },
    { CourseName: "Course_12", CourseCategory: "Technology", CourseType: "Live", CourseLevel: "Advanced", CoursePrice: 312.00, CourseRating: 4.8, CourseDuration: 20.0, EnrollmentCount: 155, TotalRevenue: 44870, PriceBand: "Premium", RatingTier: "Excellent" },
    { CourseName: "Course_13", CourseCategory: "Finance", CourseType: "Hybrid", CourseLevel: "Intermediate", CoursePrice: 278.90, CourseRating: 3.5, CourseDuration: 18.5, EnrollmentCount: 148, TotalRevenue: 38480, PriceBand: "High", RatingTier: "Average" },
    { CourseName: "Course_14", CourseCategory: "Design", CourseType: "Video", CourseLevel: "Beginner", CoursePrice: 89.99, CourseRating: 4.6, CourseDuration: 12.0, EnrollmentCount: 160, TotalRevenue: 13312, PriceBand: "Medium", RatingTier: "Good" },
    { CourseName: "Course_15", CourseCategory: "Data Science", CourseType: "Live", CourseLevel: "Intermediate", CoursePrice: 213.40, CourseRating: 4.3, CourseDuration: 17.1, EnrollmentCount: 179, TotalRevenue: 35430, PriceBand: "High", RatingTier: "Good" },
    { CourseName: "Course_16", CourseCategory: "Design", CourseType: "Live", CourseLevel: "Advanced", CoursePrice: 497.85, CourseRating: 4.9, CourseDuration: 22.0, EnrollmentCount: 190, TotalRevenue: 87361, PriceBand: "Premium", RatingTier: "Excellent" },
    { CourseName: "Course_17", CourseCategory: "Business", CourseType: "Hybrid", CourseLevel: "Beginner", CoursePrice: 185.00, CourseRating: 3.8, CourseDuration: 15.0, EnrollmentCount: 165, TotalRevenue: 28050, PriceBand: "High", RatingTier: "Average" },
    { CourseName: "Course_18", CourseCategory: "Health", CourseType: "Live", CourseLevel: "Intermediate", CoursePrice: 448.57, CourseRating: 3.7, CourseDuration: 8.2, EnrollmentCount: 163, TotalRevenue: 67564, PriceBand: "Premium", RatingTier: "Average" },
    { CourseName: "Course_19", CourseCategory: "Language", CourseType: "Video", CourseLevel: "Beginner", CoursePrice: 55.00, CourseRating: 4.2, CourseDuration: 10.0, EnrollmentCount: 170, TotalRevenue: 8640, PriceBand: "Medium", RatingTier: "Good" },
  ]
};

// Prediction model (linear approximation)
function predictEnrollment({ coursePrice, courseDuration, courseRating, teacherRating, yearsOfExperience }) {
  const base = 167;
  const priceEffect = -0.04 * coursePrice;
  const durationEffect = 0.3 * courseDuration;
  const ratingEffect = 4.2 * courseRating;
  const teacherEffect = 3.1 * teacherRating;
  const expEffect = 0.8 * yearsOfExperience;
  return Math.max(10, Math.round(base + priceEffect + durationEffect + ratingEffect + teacherEffect + expEffect));
}
function predictRevenue({ coursePrice, enrollmentCount }) {
  return Math.round(coursePrice * enrollmentCount * 0.93);
}

const CAT_COLORS = ["#f97316","#3b82f6","#10b981","#8b5cf6","#ec4899","#f59e0b","#06b6d4","#84cc16","#ef4444","#6366f1"];

const fmt$ = n => `$${(n/1000).toFixed(1)}K`;
const fmtFull$ = n => `$${n.toLocaleString()}`;

// ─── COMPONENTS ─────────────────────────────────────────────────────────────
const KPI = ({ label, value, sub, color }) => (
  <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${color}33`, borderRadius: 12, padding: "18px 20px", flex: 1 }}>
    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 700, color, fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
    <span style={{ width: 3, height: 16, background: "#6366f1", borderRadius: 2, display: "inline-block" }} />
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "#fff" }}>{p.name}: <b>{typeof p.value === "number" && p.value > 1000 ? fmtFull$(p.value) : p.value}</b></div>
      ))}
    </div>
  );
};

export default function EduProDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [targetModel, setTargetModel] = useState("Revenue");
  const [fiTarget, setFiTarget] = useState("revenue");
  const [catMetric, setCatMetric] = useState("TotalRevenue");
  const [filterCat, setFilterCat] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");
  // Predictor state
  const [price, setPrice] = useState(199);
  const [duration, setDuration] = useState(12);
  const [rating, setRating] = useState(4.0);
  const [tRating, setTRating] = useState(4.2);
  const [exp, setExp] = useState(7);

  const predicted_enroll = predictEnrollment({ coursePrice: price, courseDuration: duration, courseRating: rating, teacherRating: tRating, yearsOfExperience: exp });
  const predicted_rev = predictRevenue({ coursePrice: price, enrollmentCount: predicted_enroll });

  const modelData = DATA.model_results.filter(r => r.target === targetModel);
  const fiData = (fiTarget === "revenue" ? DATA.feature_importance_revenue : DATA.feature_importance_enrollment);
  const fiSorted = Object.entries(fiData).sort((a,b) => b[1]-a[1]).slice(0,8).map(([k,v]) => ({ name: k, value: parseFloat((v*100).toFixed(1)) }));

  const catData = DATA.category_revenue.map((r,i) => ({ ...r, color: CAT_COLORS[i % CAT_COLORS.length] }));

  const filteredCourses = useMemo(() => {
    return DATA.course_data.filter(c =>
      (filterCat === "All" || c.CourseCategory === filterCat) &&
      (filterLevel === "All" || c.CourseLevel === filterLevel)
    );
  }, [filterCat, filterLevel]);

  const categories = [...new Set(DATA.course_data.map(c => c.CourseCategory))].sort();
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "models", label: "ML Models" },
    { id: "features", label: "Feature Importance" },
    { id: "categories", label: "Category Analysis" },
    { id: "predictor", label: "Demand Predictor" },
    { id: "courses", label: "Course Explorer" },
  ];

  const styles = {
    app: { background: "#0a0f1e", minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Inter', sans-serif", fontSize: 13 },
    header: { background: "linear-gradient(135deg, #1a1f3c 0%, #0d1117 100%)", borderBottom: "1px solid #1e293b", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { fontSize: 20, fontWeight: 800, background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    badge: { background: "#1e293b", border: "1px solid #334155", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#94a3b8" },
    nav: { display: "flex", gap: 4, padding: "12px 24px", borderBottom: "1px solid #1e293b", background: "#0d1117", overflowX: "auto" },
    navBtn: (active) => ({ background: active ? "#6366f1" : "transparent", color: active ? "#fff" : "#64748b", border: active ? "none" : "1px solid transparent", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontWeight: active ? 600 : 400, fontSize: 12, whiteSpace: "nowrap", transition: "all 0.15s" }),
    content: { padding: 24, maxWidth: 1200, margin: "0 auto" },
    card: { background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 20, marginBottom: 20 },
    select: { background: "#1e293b", border: "1px solid #334155", borderRadius: 6, color: "#e2e8f0", padding: "5px 10px", fontSize: 12, cursor: "pointer" },
    row: { display: "flex", gap: 16, flexWrap: "wrap" },
    slider: { width: "100%", accentColor: "#6366f1" },
  };

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet" />

      <div style={styles.header}>
        <div>
          <div style={styles.logo}>EduPro Analytics</div>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>Predictive Course Demand & Revenue Intelligence</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={styles.badge}>60 Courses</span>
          <span style={styles.badge}>60 Teachers</span>
          <span style={styles.badge}>10K Transactions</span>
        </div>
      </div>

      <div style={styles.nav}>
        {tabs.map(t => (
          <button key={t.id} style={styles.navBtn(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div style={styles.content}>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <>
            <div style={{ ...styles.row, marginBottom: 20 }}>
              <KPI label="Total Platform Revenue" value={fmtFull$(DATA.summary.total_revenue)} sub="All courses combined" color="#6366f1" />
              <KPI label="Total Enrollments" value={DATA.summary.total_enrollments.toLocaleString()} sub="Across 10K transactions" color="#10b981" />
              <KPI label="Avg Course Price" value={`$${DATA.summary.avg_course_price}`} sub="Range: $9.99 – $499.99" color="#f97316" />
              <KPI label="Avg Course Rating" value={DATA.summary.avg_course_rating} sub="Out of 5.0" color="#f59e0b" />
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.card, flex: 2 }}>
                <SectionTitle>Revenue by Category</SectionTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={catData} margin={{ left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="CourseCategory" tick={{ fill: "#64748b", fontSize: 11 }} />
                    <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tick={{ fill: "#64748b", fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="TotalRevenue" name="Revenue" radius={[4,4,0,0]}>
                      {catData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ ...styles.card, flex: 1 }}>
                <SectionTitle>Top 5 Courses by Revenue</SectionTitle>
                {DATA.top_courses.slice(0,5).map((c, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 4 ? "1px solid #1e293b" : "none" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 12 }}>{c.CourseName}</div>
                      <div style={{ color: "#6366f1", fontSize: 10 }}>{c.CourseCategory} · ⭐ {c.CourseRating}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#10b981", fontWeight: 700, fontSize: 13 }}>{fmtFull$(c.TotalRevenue)}</div>
                      <div style={{ color: "#64748b", fontSize: 10 }}>{c.EnrollmentCount} enrolled</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <SectionTitle>Best Model Performance Summary</SectionTitle>
              <div style={styles.row}>
                {[
                  { label: "Best Enrollment Model", name: "Gradient Boosting", metric: "MAE: 8.89 | R²: -0.13", note: "Enrollment is noisy (uniform dist.)", color: "#f97316" },
                  { label: "Best Revenue Model", name: "Gradient Boosting", metric: "R²: 0.9758 | RMSE: $2,862", note: "Excellent revenue predictability", color: "#10b981" },
                  { label: "Top Revenue Driver", name: "Course Price", metric: "74.9% importance", note: "Dominates revenue prediction", color: "#6366f1" },
                  { label: "Top Enrollment Driver", name: "Course Price + Duration", metric: "25.2% + 23.0%", note: "Price-duration balance key", color: "#8b5cf6" },
                ].map((item, i) => (
                  <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.02)", border: `1px solid ${item.color}22`, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>{item.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: item.color, margin: "4px 0" }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{item.metric}</div>
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 4, fontStyle: "italic" }}>{item.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── ML MODELS ── */}
        {activeTab === "models" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <SectionTitle>Model Evaluation — </SectionTitle>
              <select style={styles.select} value={targetModel} onChange={e => setTargetModel(e.target.value)}>
                <option value="Revenue">Revenue Target</option>
                <option value="Enrollment">Enrollment Target</option>
              </select>
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.card, flex: 2 }}>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>R² Score (higher = better). Revenue models show excellent fit. Enrollment is uniform-distributed, making it inherently harder to predict.</div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={modelData} margin={{ left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="model" tick={{ fill: "#64748b", fontSize: 10 }} />
                    <YAxis domain={targetModel === "Revenue" ? [0.9, 1] : [-0.7, 0.1]} tick={{ fill: "#64748b", fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="R2" name="R² Score" radius={[4,4,0,0]}>
                      {modelData.map((entry, i) => (
                        <Cell key={i} fill={entry.R2 > 0.95 ? "#10b981" : entry.R2 > 0 ? "#6366f1" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ ...styles.card, flex: 1 }}>
                <SectionTitle>Metric Comparison</SectionTitle>
                {modelData.map((m, i) => (
                  <div key={i} style={{ padding: "8px 0", borderBottom: i < modelData.length-1 ? "1px solid #1e293b" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 12 }}>{m.model}</span>
                      <span style={{ color: m.R2 > 0.9 ? "#10b981" : m.R2 > 0 ? "#f59e0b" : "#ef4444", fontWeight: 700, fontSize: 12 }}>R²={m.R2}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12, color: "#64748b", fontSize: 11 }}>
                      <span>MAE: {targetModel === "Revenue" ? `$${m.MAE.toLocaleString()}` : m.MAE}</span>
                      <span>RMSE: {targetModel === "Revenue" ? `$${m.RMSE.toLocaleString()}` : m.RMSE}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <SectionTitle>EDA Insights — Key Patterns Found</SectionTitle>
              <div style={styles.row}>
                {[
                  { insight: "Revenue R² = 0.976", detail: "Gradient Boosting explains 97.6% of revenue variance. Course price alone drives 74.9% of prediction signal.", tag: "Revenue" },
                  { insight: "Enrollment uniform distribution", detail: "Enrollments range 142–204 with near-uniform spread. Price/duration are primary drivers but signal is noisy.", tag: "Enrollment" },
                  { insight: "Finance dominates revenue", detail: "Finance courses generate $316K (14.5% of total) with only 7 courses and highest avg price of $298.9.", tag: "Category" },
                  { insight: "Premium pricing = higher revenue", detail: "Premium-band courses ($300+) account for 68% of total revenue despite being only 31% of catalog.", tag: "Pricing" },
                ].map((item, i) => (
                  <div key={i} style={{ flex: 1, background: "rgba(99,102,241,0.05)", border: "1px solid #1e293b", borderRadius: 10, padding: 14 }}>
                    <div style={{ background: "#1e293b", borderRadius: 4, padding: "2px 8px", fontSize: 10, color: "#6366f1", display: "inline-block", marginBottom: 6 }}>{item.tag}</div>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{item.insight}</div>
                    <div style={{ color: "#64748b", fontSize: 11, lineHeight: 1.5 }}>{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── FEATURE IMPORTANCE ── */}
        {activeTab === "features" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <SectionTitle>Feature Importance — </SectionTitle>
              <select style={styles.select} value={fiTarget} onChange={e => setFiTarget(e.target.value)}>
                <option value="revenue">Revenue Model</option>
                <option value="enrollment">Enrollment Model</option>
              </select>
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.card, flex: 3 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={fiSorted} layout="vertical" margin={{ left: 30, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" tickFormatter={v => `${v}%`} tick={{ fill: "#64748b", fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} width={130} />
                    <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v}%`, "Importance"]} />
                    <Bar dataKey="value" name="Importance %" radius={[0,4,4,0]}>
                      {fiSorted.map((_, i) => <Cell key={i} fill={`hsl(${240 - i*20}, 70%, ${60 - i*3}%)`} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ ...styles.card, flex: 2 }}>
                <SectionTitle>Business Insights</SectionTitle>
                {fiTarget === "revenue" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { feature: "CoursePrice", pct: "74.9%", insight: "Pricing is the #1 lever for revenue. A 10% price increase directly boosts revenue ~9.3%.", action: "Optimize pricing with A/B tests" },
                      { feature: "PriceBand", pct: "22.2%", insight: "Premium-tier courses are disproportionately revenue-generating. Push more courses to $299+.", action: "Restructure pricing tiers" },
                      { feature: "CourseRating", pct: "1.5%", insight: "Rating has minor direct impact on revenue, but influences repeat purchases.", action: "Focus on quality signals" },
                    ].map((item, i) => (
                      <div key={i} style={{ borderLeft: "2px solid #6366f1", paddingLeft: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontWeight: 600, fontSize: 12 }}>{item.feature}</span>
                          <span style={{ color: "#6366f1", fontWeight: 700 }}>{item.pct}</span>
                        </div>
                        <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{item.insight}</div>
                        <div style={{ color: "#10b981", fontSize: 10, marginTop: 2 }}>→ {item.action}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { feature: "CoursePrice", pct: "25.2%", insight: "Lower-priced courses attract more enrollments. Consider freemium entry points.", action: "Introduce intro-tier pricing" },
                      { feature: "CourseDuration", pct: "23.0%", insight: "Moderate duration (10-20hrs) maximizes enrollment appeal vs. commitment.", action: "Target 10-20hr course length" },
                      { feature: "YearsOfExperience", pct: "11.6%", insight: "Instructor experience signals credibility and drives sign-ups.", action: "Highlight instructor credentials" },
                    ].map((item, i) => (
                      <div key={i} style={{ borderLeft: "2px solid #10b981", paddingLeft: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontWeight: 600, fontSize: 12 }}>{item.feature}</span>
                          <span style={{ color: "#10b981", fontWeight: 700 }}>{item.pct}</span>
                        </div>
                        <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{item.insight}</div>
                        <div style={{ color: "#6366f1", fontSize: 10, marginTop: 2 }}>→ {item.action}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={styles.card}>
              <SectionTitle>Radar — Feature Importance Profile</SectionTitle>
              <div style={{ display: "flex", gap: 20 }}>
                <ResponsiveContainer width="50%" height={260}>
                  <RadarChart data={fiSorted.slice(0,7)}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} />
                    <Radar name={fiTarget === "revenue" ? "Revenue" : "Enrollment"} dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
                  {fiSorted.slice(0,7).map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, fontSize: 11, color: "#94a3b8" }}>{f.name}</div>
                      <div style={{ flex: 3, background: "#1e293b", borderRadius: 3, height: 6 }}>
                        <div style={{ width: `${f.value / fiSorted[0].value * 100}%`, height: "100%", background: `hsl(${240 - i*20},70%,${60-i*3}%)`, borderRadius: 3 }} />
                      </div>
                      <div style={{ width: 36, textAlign: "right", fontSize: 11, color: "#6366f1", fontWeight: 600 }}>{f.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── CATEGORIES ── */}
        {activeTab === "categories" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <SectionTitle>Category Performance — </SectionTitle>
              <select style={styles.select} value={catMetric} onChange={e => setCatMetric(e.target.value)}>
                <option value="TotalRevenue">Total Revenue</option>
                <option value="TotalEnrollments">Total Enrollments</option>
                <option value="AvgCoursePrice">Avg Course Price</option>
              </select>
            </div>

            <div style={styles.card}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={catData.sort((a,b) => b[catMetric]-a[catMetric])} margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="CourseCategory" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis tickFormatter={v => catMetric === "TotalRevenue" ? `$${(v/1000).toFixed(0)}K` : catMetric === "AvgCoursePrice" ? `$${v}` : v} tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey={catMetric} name={catMetric.replace(/([A-Z])/g,' $1').trim()} radius={[4,4,0,0]}>
                    {catData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.row}>
              {catData.map((cat, i) => (
                <div key={i} style={{ flex: "1 1 200px", background: "#0f172a", border: `1px solid ${cat.color}33`, borderRadius: 12, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: cat.color }}>{cat.CourseCategory}</div>
                    <div style={{ background: `${cat.color}22`, borderRadius: 4, padding: "1px 6px", fontSize: 10, color: cat.color }}>{cat.CourseCount} courses</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    <div><div style={{ fontSize: 10, color: "#475569" }}>Revenue</div><div style={{ fontSize: 12, fontWeight: 600 }}>{fmtFull$(cat.TotalRevenue)}</div></div>
                    <div><div style={{ fontSize: 10, color: "#475569" }}>Enrollments</div><div style={{ fontSize: 12, fontWeight: 600 }}>{cat.TotalEnrollments.toLocaleString()}</div></div>
                    <div><div style={{ fontSize: 10, color: "#475569" }}>Avg Price</div><div style={{ fontSize: 12, fontWeight: 600 }}>${cat.AvgCoursePrice.toFixed(0)}</div></div>
                    <div><div style={{ fontSize: 10, color: "#475569" }}>Rev/Enroll</div><div style={{ fontSize: 12, fontWeight: 600 }}>${(cat.TotalRevenue/cat.TotalEnrollments).toFixed(0)}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── DEMAND PREDICTOR ── */}
        {activeTab === "predictor" && (
          <>
            <div style={styles.row}>
              <div style={{ ...styles.card, flex: 1 }}>
                <SectionTitle>Configure New Course</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { label: "Course Price", val: price, set: setPrice, min: 10, max: 500, step: 5, fmt: v => `$${v}` },
                    { label: "Course Duration (hrs)", val: duration, set: setDuration, min: 1, max: 40, step: 1, fmt: v => `${v}h` },
                    { label: "Course Rating", val: rating, set: setRating, min: 2.5, max: 5.0, step: 0.1, fmt: v => `⭐ ${v}` },
                    { label: "Teacher Rating", val: tRating, set: setTRating, min: 2.5, max: 5.0, step: 0.1, fmt: v => `⭐ ${v}` },
                    { label: "Teacher Experience (yrs)", val: exp, set: setExp, min: 1, max: 25, step: 1, fmt: v => `${v}yr` },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{item.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#6366f1" }}>{item.fmt(item.val)}</span>
                      </div>
                      <input type="range" min={item.min} max={item.max} step={item.step} value={item.val}
                        onChange={e => item.set(parseFloat(e.target.value))} style={styles.slider} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569" }}>
                        <span>{item.fmt(item.min)}</span><span>{item.fmt(item.max)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ ...styles.card, background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)", border: "1px solid #4338ca44" }}>
                  <div style={{ fontSize: 11, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Predicted Enrollments</div>
                  <div style={{ fontSize: 52, fontWeight: 800, color: "#6366f1", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{predicted_enroll.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>students (Gradient Boosting model)</div>
                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    {predicted_enroll > 180 && <span style={{ background: "#064e3b", color: "#10b981", borderRadius: 4, padding: "2px 8px", fontSize: 11 }}>↑ High Demand</span>}
                    {predicted_enroll >= 155 && predicted_enroll <= 180 && <span style={{ background: "#1c1917", color: "#f59e0b", borderRadius: 4, padding: "2px 8px", fontSize: 11 }}>→ Average Demand</span>}
                    {predicted_enroll < 155 && <span style={{ background: "#450a0a", color: "#ef4444", borderRadius: 4, padding: "2px 8px", fontSize: 11 }}>↓ Below Average</span>}
                  </div>
                </div>

                <div style={{ ...styles.card, background: "linear-gradient(135deg, #064e3b 0%, #0f172a 100%)", border: "1px solid #05966944" }}>
                  <div style={{ fontSize: 11, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Predicted Revenue</div>
                  <div style={{ fontSize: 42, fontWeight: 800, color: "#10b981", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{fmtFull$(predicted_rev)}</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>projected total revenue</div>
                  <div style={{ marginTop: 8, fontSize: 11, color: "#059669" }}>
                    = ${price} × {predicted_enroll} students × 0.93 (avg discount factor)
                  </div>
                </div>

                <div style={styles.card}>
                  <SectionTitle>Optimization Tips</SectionTitle>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {price > 400 && <div style={{ fontSize: 11, color: "#f59e0b", padding: "6px 10px", background: "#78350f22", borderRadius: 6 }}>⚠ High price may reduce enrollment. Consider $199-$299 for best balance.</div>}
                    {duration < 5 && <div style={{ fontSize: 11, color: "#f59e0b", padding: "6px 10px", background: "#78350f22", borderRadius: 6 }}>⚠ Very short duration may signal low value. Aim for 10-20hrs.</div>}
                    {rating >= 4.5 && <div style={{ fontSize: 11, color: "#10b981", padding: "6px 10px", background: "#05966922", borderRadius: 6 }}>✓ Excellent rating boosts discoverability and word-of-mouth.</div>}
                    {exp >= 10 && <div style={{ fontSize: 11, color: "#10b981", padding: "6px 10px", background: "#05966922", borderRadius: 6 }}>✓ Senior instructor adds strong credibility signal.</div>}
                    {price > 200 && duration > 15 && rating > 4 ? (
                      <div style={{ fontSize: 11, color: "#6366f1", padding: "6px 10px", background: "#6366f122", borderRadius: 6 }}>🎯 Strong premium positioning — target corporate learners.</div>
                    ) : price < 100 && duration < 10 && (
                      <div style={{ fontSize: 11, color: "#6366f1", padding: "6px 10px", background: "#6366f122", borderRadius: 6 }}>🎯 Good entry-level profile — maximize volume enrollment strategy.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── COURSE EXPLORER ── */}
        {activeTab === "courses" && (
          <>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <SectionTitle>Course Catalog</SectionTitle>
              <select style={styles.select} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <option value="All">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select style={styles.select} value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
                <option value="All">All Levels</option>
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>{filteredCourses.length} courses shown</span>
            </div>

            <div style={styles.card}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e293b" }}>
                      {["Course","Category","Type","Level","Price","Rating","Duration","Enrollments","Revenue","Price Band","Rating Tier"].map(h => (
                        <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((c, i) => {
                      const catColor = CAT_COLORS[categories.indexOf(c.CourseCategory) % CAT_COLORS.length];
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #1e293b", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                          <td style={{ padding: "7px 10px", fontWeight: 600, color: "#e2e8f0" }}>{c.CourseName}</td>
                          <td style={{ padding: "7px 10px" }}><span style={{ background: `${catColor}22`, color: catColor, borderRadius: 4, padding: "2px 7px", fontSize: 10 }}>{c.CourseCategory}</span></td>
                          <td style={{ padding: "7px 10px", color: "#94a3b8" }}>{c.CourseType}</td>
                          <td style={{ padding: "7px 10px", color: "#94a3b8" }}>{c.CourseLevel}</td>
                          <td style={{ padding: "7px 10px", color: "#f59e0b", fontWeight: 600 }}>${c.CoursePrice}</td>
                          <td style={{ padding: "7px 10px" }}>
                            <span style={{ color: c.CourseRating >= 4.5 ? "#10b981" : c.CourseRating >= 3.5 ? "#f59e0b" : "#ef4444" }}>⭐ {c.CourseRating}</span>
                          </td>
                          <td style={{ padding: "7px 10px", color: "#94a3b8" }}>{c.CourseDuration}h</td>
                          <td style={{ padding: "7px 10px", color: "#6366f1", fontWeight: 600 }}>{c.EnrollmentCount}</td>
                          <td style={{ padding: "7px 10px", color: "#10b981", fontWeight: 600 }}>{fmtFull$(c.TotalRevenue)}</td>
                          <td style={{ padding: "7px 10px" }}>
                            <span style={{ fontSize: 10, background: "#1e293b", borderRadius: 4, padding: "2px 6px", color: c.PriceBand === "Premium" ? "#f97316" : c.PriceBand === "High" ? "#f59e0b" : "#94a3b8" }}>{c.PriceBand}</span>
                          </td>
                          <td style={{ padding: "7px 10px" }}>
                            <span style={{ fontSize: 10, background: "#1e293b", borderRadius: 4, padding: "2px 6px", color: c.RatingTier === "Excellent" ? "#10b981" : c.RatingTier === "Good" ? "#6366f1" : "#94a3b8" }}>{c.RatingTier}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={styles.card}>
              <SectionTitle>Price vs Revenue Scatter</SectionTitle>
              <ResponsiveContainer width="100%" height={230}>
                <ScatterChart margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="CoursePrice" name="Price" tickFormatter={v => `$${v}`} tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "Course Price ($)", fill: "#475569", fontSize: 11, position: "insideBottom", offset: -4 }} />
                  <YAxis dataKey="TotalRevenue" name="Revenue" tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    return (
                      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", fontSize: 11 }}>
                        <div style={{ fontWeight: 600, color: "#e2e8f0" }}>{d.CourseName}</div>
                        <div style={{ color: "#f59e0b" }}>Price: ${d.CoursePrice}</div>
                        <div style={{ color: "#10b981" }}>Revenue: {fmtFull$(d.TotalRevenue)}</div>
                        <div style={{ color: "#6366f1" }}>Enrolled: {d.EnrollmentCount}</div>
                      </div>
                    );
                  }} />
                  <Scatter data={filteredCourses} fill="#6366f1" opacity={0.8}>
                    {filteredCourses.map((c, i) => (
                      <Cell key={i} fill={CAT_COLORS[categories.indexOf(c.CourseCategory) % CAT_COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

      </div>
    </div>
  );
}