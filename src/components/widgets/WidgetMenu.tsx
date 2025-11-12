import React, { useState, useRef, useEffect } from "react";
import { EllipsisVertical, Settings, Copy, Trash2 } from "lucide-react";
import { useDeleteCustomBlock } from "@/app/custom-blocks/(hooks)";
import { toast } from "fillinxsolutions-provider";
import { useRouter } from "next/navigation";
import { delete_api_template } from "@/lib/API/ApiTemplates";
import { TapdayApiPaths } from "@/lib/APIPaths/GlobalApiPaths";

// Helper component for uniform menu items
const MenuItem = ({ icon: Icon, label, onClick, isDestructive = false }) => {
  const baseClasses =
    "cursor-pointer flex w-full text-sm items-center rounded-lg p-2 transition-all";
  const colorClasses = isDestructive
    ? "text-red-600 hover:bg-red-50 focus:bg-red-50 active:bg-red-100"
    : "text-slate-800 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-200";

  return (
    <li
      role="menuitem"
      className={`${baseClasses} ${colorClasses}`}
      onClick={onClick}
    >
      <Icon className="w-3 h-3 mr-3" />
      {label}
    </li>
  );
};

const WidgetMenu = ({ widget, refetchWidgets = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleDeleteBlock } = useDeleteCustomBlock();
  const menuRef = useRef(null);
  const router = useRouter();

  // Function to toggle the menu open/closed state
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // Effect to handle clicks outside the menu container
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if the click is outside the menu container element
      // Prevent closing if the target is the button itself
      if (
        menuRef.current &&
        !(menuRef?.current as any)?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    // Attach and clean up the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]); // Dependency array ensures cleanup on unmount

  // Dynamic classes for animation and visibility
  const menuClasses = `
      absolute z-20
      min-w-[180px]
      overflow-hidden
      rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl
      transition-all duration-300 ease-in-out
      origin-top-right
      right-0 top-full mt-3
      ${
        isOpen
          ? "opacity-100 max-h-[500px] scale-y-100"
          : "opacity-0 max-h-0 scale-y-75 pointer-events-none"
      }
    `;

  // Menu item click handler (closes menu after action)
  const handleMenuItemClick = (action) => {
    console.log(`Action clicked: ${action}`);
    setIsOpen(false);
    // Add specific logic here (e.g., dispatch action, open modal)
  };

  const handleDeleteWidget = async (widget) => {
    console.log(widget?.id);

    try {
      // const response = await delete_api_template({
      //   url: TapdayApiPaths?.customWidgets.deleteById(widget?.id),
      // });
      // setdeletingBlock(true);
      // Navigate first to prevent rendering with undefined block
      // router.push('/');
      await handleDeleteBlock(widget.id);
      // router.refresh();
      await refetchWidgets();
      toast.success("widget deleted successfully", {
        position: "top-right",
      });
    } catch (error) {
      toast.error("Something went wrong, try again later", {
        position: "top-right",
      });
    } finally {
      // setdeletingBlock(false);
    }
  };

  return (
    // Outer container to center the menu for display purposes
    <div className="">
      {/* The actual menu component container */}
      <div className="relative inline-block text-left" ref={menuRef}>
        {/* Menu Toggle Button */}
        <button
          onClick={toggleMenu}
          className="
                  rounded-full p-2 bg-transparent text-white transition-all
                  shadow-lg hover:shadow-xl hover:bg-slate-700
                  focus:outline-none focus:ring-4 focus:ring-slate-400/50
                  disabled:opacity-50
                  "
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <EllipsisVertical className="w-4 h-4" />
        </button>

        {/* Dropdown Menu List */}
        <ul role="menu" className={menuClasses}>
          <MenuItem
            icon={Copy}
            label="Duplicate Widget"
            onClick={() => handleMenuItemClick("duplicate")}
          />

          {/* Separator Line */}
          <div className="my-1 h-px bg-slate-100"></div>

          <MenuItem
            icon={Trash2}
            label="Delete Widget"
            isDestructive={true}
            onClick={() => handleDeleteWidget(widget)}
          />
        </ul>
      </div>
    </div>
  );
};

export default WidgetMenu;
