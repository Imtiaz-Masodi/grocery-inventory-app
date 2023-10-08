import {
    Outlet,
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    useLocation,
} from "react-router-dom";
import GroceryList from "./components/grocery/GroceryList";
import CategoryList from "./components/category/CategoryList";
import Navbar from "./components/navbar/Navbar";
import { useEffect } from "react";
import { Container, Paper } from "@mui/material";
import UpdateInventory from "./components/inventory/UpdateInventory";
import InventoryHistory from "./components/inventory/InventoryHistory";

const RouteChangeHandler = () => {
    let location = useLocation();
    useEffect(() => {
        if (window && window.scroll) {
            window.scroll({
                behavior: "smooth",
                top: 0,
            });
        }
    }, [location]);
    return (
        <>
            <Navbar />
            <Container className="main-content">
                <Paper elevation={0} className="p-1">
                    <Outlet />
                </Paper>
            </Container>
        </>
    );
};

const Router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<RouteChangeHandler />}>
            <Route index element={<GroceryList />} />
            <Route path="/update-inventory" element={<UpdateInventory />} />
            <Route path="/history" element={<InventoryHistory />} />
            <Route path="/category" element={<CategoryList />} />
        </Route>
    )
);
export default Router;
