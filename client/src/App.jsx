import Category from "./modules/complaint/category";
import "./modules/complaint/category.css";

function App() {
  const handleSelect = (cat) => {
    alert(`Selected Category: ${cat.name}`);
  };

  return (
    <div>
      <Category onSelect={handleSelect} />
    </div>
  );
}

export default App;
