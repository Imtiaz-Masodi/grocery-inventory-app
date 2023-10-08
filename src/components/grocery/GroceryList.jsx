import { useEffect, useState } from "react";
import axiosInstance from "../../network/axios-instance";
import dateHelper from "../../helpers/dateHelper";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import GroceryItemForm from "../grocery/GroceryItemForm";
import { DataGrid } from "@mui/x-data-grid";
import {
    Button,
    Card,
    CircularProgress,
    Container,
    Dialog,
    Grid,
    Modal,
    Typography,
} from "@mui/material";

const addCategory = { _id: -1, name: "-- Add New Category --" };
const GroceryList = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [groceries, setGroceries] = useState([]);
    const [showGroceryForm, setShowGroceryForm] = useState(false);
    const [categories, setCategories] = useState([addCategory]);

    useEffect(() => {
        fetchGroceries();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get("/category");
            if (res.data.status === "success" && res.data.payload?.length > 0) {
                setCategories([...res.data.payload, addCategory]);
            } else {
            }
        } catch (ex) {}
    };

    const fetchGroceries = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get("/grocery/list");
            if (res.data.status === "success") {
                res.data.payload.map((item) => {
                    item.id = item._id;
                    item.categoryName = item.category.name;
                    item.createdOn = dateHelper.getDateAndTime(item.createdOn);
                    return item;
                });
                setGroceries(res.data.payload);
            } else {
                setErrorMessage(res.data.message);
            }
        } catch (ex) {
            setErrorMessage(ex.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGroceryFormClose = (refreshList = false) => {
        setShowGroceryForm(false);
        if (refreshList === true) fetchGroceries();
    };

    const tableColumns = [
        { field: "name", headerName: "Name", flex: 15 },
        {
            field: "description",
            headerName: "Description",
            flex: 30,
            sortable: false,
        },
        { field: "categoryName", headerName: "Category", flex: 20 },
        { field: "price", headerName: "Price", flex: 10 },
        { field: "stockCount", headerName: "Stock Count", flex: 10 },
        { field: "createdOn", headerName: "Created On", flex: 15 },
    ];

    if (isLoading) {
        return (
            <Grid
                container
                direction="column"
                justifyContent="center"
                gap="1rem"
                alignItems="center"
                className="my-5"
            >
                <CircularProgress />
                <Typography>Loading grocery list. Please wait...</Typography>
            </Grid>
        );
    }

    if (errorMessage) {
        return (
            <Grid
                container
                direction="column"
                justifyContent="center"
                gap="1rem"
                alignItems="center"
                className="my-5"
            >
                <Typography variant="body1" style={{color: 'red'}}>{errorMessage}</Typography>
            </Grid>
        );
    }

    return (
        <Container>
            {groceries && groceries.length > 0 ? (
                <>
                    <Grid container alignItems="center">
                        <Grid item xs>
                            <Typography variant="h5" className="py-1">
                                Groceries List
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="text"
                                startIcon={<AddRoundedIcon />}
                                onClick={() => setShowGroceryForm(true)}
                            >
                                Add Grocery Item
                            </Button>
                        </Grid>
                    </Grid>
                    <DataGrid
                        rows={groceries}
                        columns={tableColumns}
                        pageSizeOptions={[10, 25, 50]}
                        // paginationModel={{page: 0, pageSize: 10}}
                    />
                </>
            ) : (
                <></>
            )}

            {showGroceryForm && (
                <Dialog
                    open
                    onClose={handleGroceryFormClose}
                    maxWidth={"sm"}
                    PaperComponent="span"
                >
                    <Card className="p-2 br-1">
                        <GroceryItemForm
                            categories={categories}
                            onCloseDialog={handleGroceryFormClose}
                        />
                    </Card>
                </Dialog>
            )}
        </Container>
    );
};

export default GroceryList;
