import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LiveWebinar from "@/components/LiveWebinar";

const Index = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const registrationData = localStorage.getItem('registrationData');
    if (!registrationData) {
      navigate('/');
    }
  }, [navigate]);
  return <LiveWebinar />;
};

export default Index;
