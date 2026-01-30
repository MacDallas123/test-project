// components/ui/menu-item-shadcn.tsx
import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

const CollapsibleMenuItem = ({ label, icon, children, closeMobileMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg text-primary-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-destructive">{icon}</span>
          <span>{label}</span>
        </div>
        <ChevronsUpDown
          className="w-4 h-4 transition-transform duration-200 text-destructive"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="py-3 pl-3 ml-6 space-y-1 border-l border-gray-200 dark:border-gray-700"
          >
            {children?.map((child, index) => {
              //const IconComponent = child.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  key={index}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 28,
                    delay: index * 0.07, // 70ms interval between each item
                  }}
                >
                  <Link to={child.href} className="w-full" onclick={closeMobileMenu}>
                    <Button
                      variant="ghost"
                      className="justify-start w-full text-sm transition-colors border-t border-b rounded-none cursor-pointer text-primary-foreground hover:text-foreground hover:bg-accent/50"
                      
                    >
                      {/* <IconComponent className="w-4 h-4 mr-3" /> */}
                      {child.label}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleMenuItem;
