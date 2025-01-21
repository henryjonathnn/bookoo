import react from "react"
import { Eye, MoreVertical, PenTool, Trash2 } from "react-feather";

const TombolAksi = () => (
    <div className="flex items-center gap-2">
      <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
        <Eye size={18} className="text-gray-400" />
      </button>
      <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
        <PenTool size={18} className="text-gray-400" />
      </button>
      <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
        <Trash2 size={18} className="text-gray-400" />
      </button>
      <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
        <MoreVertical size={18} className="text-gray-400" />
      </button>
    </div>
  );
  
  export default TombolAksi;