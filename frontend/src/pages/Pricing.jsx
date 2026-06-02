const plans = [
  {
    name: "Free",
    price: "₹0",
    items: ["Basic analysis", "Limited exports", "Core templates"],
  },
  {
    name: "Pro",
    price: "₹199/mo",
    items: ["Advanced AI analysis", "Builder access", "More templates"],
  },
  {
    name: "Premium",
    price: "₹499/mo",
    items: ["Priority support", "Unlimited exports", "Full AI toolkit"],
  },
];

export default function Pricing() {
  return (
    <div className="content-card glass">
      <span className="hero-badge">Pricing</span>
      <h1 style={{ marginTop: 14 }}>Simple plans for every user</h1>
      <p className="section-note">
        Choose a plan that fits your resume workflow, from testing to premium
        SaaS usage.
      </p>

      <div className="feature-grid" style={{ marginTop: 22 }}>
        {plans.map((plan) => (
          <div className="feature-item" key={plan.name}>
            <h3>{plan.name}</h3>
            <p style={{ fontSize: 30, fontWeight: 900, color: "#0f172a" }}>{plan.price}</p>
            <ul style={{ paddingLeft: 18, lineHeight: 1.8 }}>
              {plan.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}