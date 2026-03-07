import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar, MapPin, Link2, Users, Clock, CheckCircle2 } from "lucide-react";
import { format, isPast } from "date-fns";

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<Record<string, boolean>>({});
  const [regCounts, setRegCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    const { data: evts } = await supabase.from("events").select("*").order("event_date", { ascending: true });
    setEvents(evts || []);

    if (user) {
      const { data: regs } = await supabase.from("event_registrations").select("event_id").eq("user_id", user.id);
      const regMap: Record<string, boolean> = {};
      (regs || []).forEach((r: any) => { regMap[r.event_id] = true; });
      setRegistrations(regMap);
    }

    // Get counts
    const { data: allRegs } = await supabase.from("event_registrations").select("event_id");
    const counts: Record<string, number> = {};
    (allRegs || []).forEach((r: any) => { counts[r.event_id] = (counts[r.event_id] || 0) + 1; });
    setRegCounts(counts);
    setLoading(false);
  };

  const handleRegister = async (eventId: string) => {
    if (!user) return;
    const { error } = await supabase.from("event_registrations").insert({ event_id: eventId, user_id: user.id });
    if (error) { toast.error("Already registered or error"); return; }
    toast.success("Registered successfully!");
    setRegistrations((prev) => ({ ...prev, [eventId]: true }));
    setRegCounts((prev) => ({ ...prev, [eventId]: (prev[eventId] || 0) + 1 }));
  };

  const handleUnregister = async (eventId: string) => {
    if (!user) return;
    await supabase.from("event_registrations").delete().eq("event_id", eventId).eq("user_id", user.id);
    toast.success("Unregistered");
    setRegistrations((prev) => { const n = { ...prev }; delete n[eventId]; return n; });
    setRegCounts((prev) => ({ ...prev, [eventId]: Math.max(0, (prev[eventId] || 1) - 1) }));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold"><span className="gradient-text-neon">Events</span> & Workshops</h1>
        <p className="text-muted-foreground mt-1">Register for upcoming events and workshops</p>
      </div>

      {events.length === 0 ? (
        <div className="neon-card rounded-2xl p-12 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No events scheduled yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => {
            const past = event.event_date && isPast(new Date(event.event_date));
            const registered = registrations[event.id];
            const count = regCounts[event.id] || 0;
            const full = event.max_participants && count >= event.max_participants;

            return (
              <div key={event.id} className={`neon-card rounded-2xl p-6 ${past ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      past ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                    }`}>
                      {past ? "Completed" : event.status || "Upcoming"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    {count}{event.max_participants ? `/${event.max_participants}` : ""}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">{event.title}</h3>
                {event.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>}

                <div className="space-y-2 mb-4">
                  {event.event_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {format(new Date(event.event_date), "PPP 'at' p")}
                    </div>
                  )}
                  {event.speaker && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      Speaker: {event.speaker}
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  )}
                  {event.meeting_link && (
                    <a href={event.meeting_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Link2 className="w-4 h-4" />
                      Join Online
                    </a>
                  )}
                </div>

                {!past && (
                  registered ? (
                    <button onClick={() => handleUnregister(event.id)} className="w-full py-2.5 rounded-xl border border-primary/30 text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
                      <CheckCircle2 className="w-4 h-4" /> Registered — Tap to Cancel
                    </button>
                  ) : (
                    <button onClick={() => handleRegister(event.id)} disabled={!!full} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all disabled:opacity-50">
                      {full ? "Event Full" : "Register Now"}
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
