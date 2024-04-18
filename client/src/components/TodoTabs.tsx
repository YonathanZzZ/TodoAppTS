import { Box, Tab, Tabs } from "@mui/material"
import {Dispatch, SetStateAction} from "react";

interface TodoTabsProps {
    tabIndex: number;
    setTabIndex: Dispatch<SetStateAction<number>>;
}
const TodoTabs = ({tabIndex, setTabIndex}: TodoTabsProps) => {
    
  const handleTabChange = (_: any, index: number) => {
    setTabIndex(index);
  };
    
    return(
        <Box className="tabs-box">
                        <Tabs value={tabIndex} onChange={handleTabChange}>
                          <Tab label="Todo" />
                          <Tab label="Done" />
                        </Tabs>
                      </Box>
    )
}

export default TodoTabs;