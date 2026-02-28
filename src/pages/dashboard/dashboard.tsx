//..ok
import Header from "@/components/header/header";
import SceneImages from "@/components/sceneImages/sceneImages";
import "./dashboard.scss";
import AgeCircle from "@/components/ageCircle/AgeCircle";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />

      <div className="main-scene-wrapper">
        <SceneImages />
        <AgeCircle />
      </div>
      <footer />
    </div>
  );
};

export default Dashboard;
