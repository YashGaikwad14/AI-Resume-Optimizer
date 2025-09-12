import { useState } from "react";
import NewHeader from "../components/NewHeader";

export default function Pricing() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  const onUpgrade = async () => {
    try {
      if (!token) { 
        window.location.href = '/signin'; 
        return; 
      }
      
      setIsUpgrading(true);
      setUpgradeMessage("");
      
      console.log('Attempting upgrade with token:', token ? 'present' : 'missing');
      
      const res = await fetch('http://localhost:5000/auth/upgrade', { 
        method: 'POST', 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      });
      
      console.log('Upgrade response status:', res.status);
      const data = await res.json();
      console.log('Upgrade response data:', data);
      
      if (data?.ok) {
        setUpgradeMessage("Success! Upgrading to premium...");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setUpgradeMessage(`Error: ${data?.error || 'Upgrade failed'}`);
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      setUpgradeMessage(`Error: ${err.message || 'Network error'}`);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6">
        <NewHeader />
        <div className="mt-6 rounded-2xl border border-border bg-secondary p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Upgrade to Premium</h2>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">Unlock all advanced tools including ATS Optimizer, Skills Gap Analysis, and more.</p>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="p-4 sm:p-6 rounded-xl border border-border bg-background/30">
              <h3 className="font-semibold mb-2">Free</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Analyze Resume</li>
                <li>Score Match</li>
                <li>Cover Letter</li>
              </ul>
            </div>
            <div className="p-4 sm:p-6 rounded-xl border border-primary/40 bg-gradient-to-br from-amber-500/10 to-rose-500/10">
              <h3 className="font-semibold mb-2">Premium</h3>
              <ul className="text-sm text-foreground space-y-1">
                <li>Everything in Free</li>
                <li>Rewrite Bullets</li>
                <li>Skills Gap Analysis</li>
                <li>Tailor Resume</li>
                <li>Interview Questions</li>
                <li>LinkedIn Suggestions</li>
                <li>ATS Optimizer</li>
              </ul>
              <button 
                className="mt-4 btn-primary w-full sm:w-auto text-sm sm:text-base" 
                onClick={onUpgrade}
                disabled={isUpgrading}
              >
                {isUpgrading ? "Upgrading..." : "Unlock Premium"}
              </button>
              {upgradeMessage && (
                <div className={`mt-2 text-sm ${upgradeMessage.includes('Success') ? 'text-green-600' : 'text-red-600'}`}>
                  {upgradeMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


