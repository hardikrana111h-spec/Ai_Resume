import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const plans = [
  {
    name: "Free Trial",
    price: "₹0",
    validityText: "3 Days Validity",
    validityDays: 3,
    limit: 3,
    items: [
      "3 Total Resume Analyses per Day",
      "Basic ATS Score",
      "Basic Templates",
    ],
    defaultBtnText: "Start Free Trial",
  },
  {
    name: "Pro",
    price: "₹199",
    validityText: "30 Days Validity",
    validityDays: 30,
    limit: 50,
    items: [
      "50 Resume Analyses per Day",
      "Resume Builder",
      "Premium Templates",
    ],
    defaultBtnText: "Get Pro",
  },
  {
    name: "Premium",
    price: "₹499",
    validityText: "30 Days Validity",
    validityDays: 30,
    limit: 100,
    items: [
      "100 Resume Analyses per Day",
      "AI Cover Letter",
      "LinkedIn Analysis",
    ],
    defaultBtnText: "Get Premium",
  },
];

export default function Pricing() {
  const [currentPlan, setCurrentPlan] = useState("");
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(false);
  const navigate = useNavigate();
  const userEmail = "logged_in_user@example.com"; 

  useEffect(() => {
    const usedTrial = localStorage.getItem("has_used_free_trial");
    if (usedTrial) {
      setHasUsedFreeTrial(true);
    }

    const savedData = localStorage.getItem("user_plan_data");
    if (savedData) {
      const savedPlan = JSON.parse(savedData);
      if (Date.now() < savedPlan.expiryDate) {
        setCurrentPlan(savedPlan.planName);
      } else {
        localStorage.removeItem("user_plan_data"); 
      }
    }
  }, []);

  const updateUserPlan = (plan) => {
    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(now.getDate() + plan.validityDays);
    const today = new Date().toISOString().split("T")[0];

    const planData = {
      planName: plan.name,
      expiryDate: expiryDate.getTime(),
      dailyLimit: plan.limit,
      todayUsed: 0,
      remainingLimit: plan.limit,
      lastResetDate: today,
    };

    localStorage.setItem("user_plan_data", JSON.stringify(planData));

    if (plan.name === "Free Trial") {
      localStorage.setItem("has_used_free_trial", "true");
      setHasUsedFreeTrial(true);
    }
    setCurrentPlan(plan.name); 
  };

  const handlePayment = async (plan) => {
    if (plan.price === "₹0") {
      updateUserPlan(plan);
      await Swal.fire({
        icon: "success",
        title: "Awesome!",
        text: `You are now using the ${plan.name}! Valid for ${plan.validityDays} days.`,
        confirmButtonColor: "#10b981",
      });
      navigate("/analyze"); 
      return;
    }

    const numericPrice = parseInt(plan.price.replace("₹", ""));

    try {
      const orderRes = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: numericPrice, planName: plan.name }),
        }
      );
      const orderData = await orderRes.json();

      if (!orderData.success) {
        return Swal.fire({
          icon: "error",
          title: "Order Failed",
          text: "Failed to create order. Check backend.",
        });
      }

      const options = {
        key: "rzp_test_T5Oc4Wb5bs1uqJ",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "AI Resume Pro",
        description: `Upgrade to ${plan.name}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          const verifyRes = await fetch(
            "http://localhost:5000/api/payment/verify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userEmail: userEmail,
                planName: plan.name,
              }),
            }
          );

          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            updateUserPlan(plan);
            await Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              text: `You are now on the ${plan.name} plan!`,
              confirmButtonColor: "#10b981"
            });
            navigate("/analyze");
          } else {
            Swal.fire({
              icon: "error",
              title: "Payment Failed",
              text: "Payment verification failed!",
            });
          }
        },
        prefill: { email: userEmail },
        theme: { color: "#0f172a" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong processing your request.",
      });
    }
  };

  return (
    <>
      <style>
        {`
          .pricing-wrapper {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            box-sizing: border-box;
          }
          .content-card {
            max-width: 1100px; width: 100%; text-align: center;
            padding: 3rem 2rem; border-radius: 24px;
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
          }
          .hero-badge {
            background: #e2e8f0; color: #334155; padding: 0.5rem 1rem;
            border-radius: 9999px; font-size: 0.875rem; font-weight: 700;
            text-transform: uppercase; letter-spacing: 0.05em;
          }
          .content-card h1 { margin-top: 14px; font-size: 2.5rem; color: #0f172a; }
          .section-note { color: #475569; font-size: 1.125rem; margin: 1rem auto; }
          
          .feature-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem; margin-top: 32px;
          }
          .feature-item {
            background: #ffffff; padding: 2.5rem 2rem; border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.02); text-align: left;
            border: 1px solid #e2e8f0; display: flex; flex-direction: column;
            transition: transform 0.2s; position: relative;
          }
          .feature-item.active-card {
            border: 2px solid #10b981;
            box-shadow: 0 12px 24px rgba(16, 185, 129, 0.15);
          }
          .feature-item:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }
          .feature-item h3 { margin: 0; color: #0f172a; font-size: 1.5rem; font-weight: 700; }
          
          .badges-wrapper { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1.2rem; }
          .info-badge { background: #f1f5f9; color: #475569; font-size: 0.85rem; font-weight: 700; padding: 6px 12px; border-radius: 8px; display: inline-flex; align-items: center; }
          .info-badge.highlight-limit { background: #e0e7ff; color: #4338ca; border: 1px solid #c7d2fe; }

          .feature-item ul { margin: 1rem 0 2.5rem 0; color: #334155; flex-grow: 1; padding-left: 20px; }
          .feature-item li { margin-bottom: 0.75rem; font-size: 1.05rem; }
          .feature-item li::marker { color: #3b82f6; }
          
          .plan-button {
            width: 100%; padding: 1rem; border: none; border-radius: 8px;
            font-weight: 600; font-size: 1.1rem; cursor: pointer; 
            transition: all 0.2s; margin-top: auto;
          }
          .plan-button.standard { background-color: #0f172a; color: white; }
          .plan-button.standard:hover:not(:disabled) { background-color: #1e293b; transform: scale(1.02); }
          .plan-button.highlight { background-color: #3b82f6; color: white; }
          .plan-button.highlight:hover:not(:disabled) { background-color: #2563eb; transform: scale(1.02); }
          .plan-button.active-btn { background-color: #10b981; color: white; cursor: default; }
          .plan-button:disabled { opacity: 0.6; cursor: not-allowed; }

          /* Responsive Breakpoints */
          @media (max-width: 1024px) {
            .feature-grid { gap: 1.5rem; }
            .feature-item { padding: 2rem 1.5rem; }
          }

          @media (max-width: 768px) {
            .pricing-wrapper { padding: 1rem; }
            .content-card { padding: 2rem 1.5rem; }
            .content-card h1 { font-size: 2rem; }
            .section-note { font-size: 1rem; }
            .feature-grid { grid-template-columns: 1fr; max-width: 400px; margin-left: auto; margin-right: auto; }
            .feature-item:hover { transform: none; } /* Disable hover lift on mobile */
          }

          @media (max-width: 480px) {
            .content-card { padding: 1.5rem 1rem; border-radius: 16px; }
            .content-card h1 { font-size: 1.75rem; }
            .badges-wrapper { flex-direction: row; }
          }
        `}
      </style>

      <div className="pricing-wrapper">
        <div className="content-card">
          <span className="hero-badge">Pricing</span>
          <h1>Simple plans for your career</h1>
          <p className="section-note">
            Choose a plan to boost your resume workflow.
          </p>

          <div className="feature-grid">
            {plans.map((plan) => {
              const isCurrentPlan = currentPlan === plan.name;
              let buttonText = plan.defaultBtnText;
              let buttonClass = plan.name === "Premium" ? "plan-button highlight" : "plan-button standard";
              let isDisabled = false;

              if (isCurrentPlan) {
                buttonText = "Current Active Plan ✓";
                buttonClass = "plan-button active-btn";
                isDisabled = true;
              } else if (plan.name === "Free Trial" && hasUsedFreeTrial) {
                buttonText = "Trial Already Used";
                isDisabled = true;
              }

              return (
                <div className={`feature-item ${isCurrentPlan ? "active-card" : ""}`} key={plan.name}>
                  <h3>{plan.name}</h3>
                  <p style={{ fontSize: 42, fontWeight: 900, color: "#0f172a", margin: "10px 0" }}>
                    {plan.price}
                  </p>

                  <div className="badges-wrapper">
                    <span className="info-badge">📅 {plan.validityDays} Days</span>
                    <span className="info-badge highlight-limit">⚡ {plan.limit} Analyses / Day</span>
                  </div>

                  {isCurrentPlan && (
                    <div style={{ marginBottom: 18, padding: 12, background: "#ECFDF5", border: "1px solid #10B981", borderRadius: 10, color: "#065F46", fontWeight: 700 }}>
                      ✅ Current Active Plan<br />Valid for {plan.validityDays} Days
                    </div>
                  )}

                  <ul style={{ lineHeight: 1.8 }}>
                    {plan.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <button className={buttonClass} disabled={isDisabled} onClick={() => handlePayment(plan)}>
                    {buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}