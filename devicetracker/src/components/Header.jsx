import { Search, Bell, Plus } from "lucide-react";
import "./Header.css";

export default function Header({ onAddDevice }) {
  return (
    <header className="header">
      <div className="header-search">
        <Search size={20} />
        <input type="text" placeholder="Search devices..." />
      </div>
      <div className="header-actions">
        <button className="btn-add" onClick={onAddDevice}>
          <Plus size={20} />
          <span>Add Vehicle</span>
        </button>
        <button className="btn-icon">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
      </div>
    </header>
  );
}
