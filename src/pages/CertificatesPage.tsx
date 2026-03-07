import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Award, Download } from "lucide-react";
import { format } from "date-fns";
import { jsPDF } from "jspdf";

const CertificatesPage: React.FC = () => {
  const { user, userCode } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("certificates").select("*").eq("user_id", user.id).order("issued_at", { ascending: false }).then(({ data }) => {
      setCerts(data || []);
      setLoading(false);
    });
  }, [user]);

  const downloadCert = (cert: any) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    // Background
    doc.setFillColor(15, 15, 30);
    doc.rect(0, 0, 297, 210, "F");

    // Border
    doc.setDrawColor(120, 80, 220);
    doc.setLineWidth(2);
    doc.roundedRect(10, 10, 277, 190, 5, 5);

    // Inner border
    doc.setDrawColor(60, 40, 120);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 15, 267, 180, 3, 3);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120, 80, 220);
    doc.setFontSize(14);
    doc.text("CODECLUB PRO", 148.5, 40, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.text("Certificate of Achievement", 148.5, 60, { align: "center" });

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 200);
    doc.setFontSize(14);
    doc.text("This is to certify that", 148.5, 80, { align: "center" });

    // Name
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 200, 255);
    doc.setFontSize(28);
    doc.text(userCode || "Member", 148.5, 100, { align: "center" });

    // Achievement
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 200);
    doc.setFontSize(14);
    doc.text(`has successfully completed`, 148.5, 118, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(cert.title, 148.5, 135, { align: "center" });

    if (cert.description) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(160, 160, 180);
      doc.setFontSize(11);
      doc.text(cert.description, 148.5, 148, { align: "center", maxWidth: 200 });
    }

    // Date
    doc.setFontSize(11);
    doc.setTextColor(140, 140, 160);
    doc.text(`Issued on ${format(new Date(cert.issued_at), "MMMM d, yyyy")}`, 148.5, 170, { align: "center" });

    // Badge type
    doc.setFontSize(10);
    doc.setTextColor(120, 80, 220);
    doc.text(cert.cert_type.toUpperCase(), 148.5, 182, { align: "center" });

    doc.save(`certificate-${cert.title.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold"><span className="gradient-text-neon">Certificates</span></h1>
        <p className="text-muted-foreground mt-1">Download your earned certificates</p>
      </div>

      {certs.length === 0 ? (
        <div className="neon-card rounded-2xl p-12 text-center">
          <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No certificates earned yet — keep participating!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((cert) => (
            <div key={cert.id} className="neon-card rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{cert.title}</h3>
              {cert.description && <p className="text-sm text-muted-foreground mb-3">{cert.description}</p>}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{format(new Date(cert.issued_at), "MMM d, yyyy")}</span>
                <button onClick={() => downloadCert(cert)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
