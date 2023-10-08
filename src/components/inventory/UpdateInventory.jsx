import { useEffect, useState } from "react";
import axiosInstance from "../../network/axios-instance";
import {
    CircularProgress,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import BackupIcon from "@mui/icons-material/Backup";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import dateHelper from "../../helpers/dateHelper";

const UpdateInventory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [groceries, setGroceries] = useState([]);

    const fetchGroceries = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get("/grocery/list");
            if (res.data.status === "success") {
                res.data.payload.map((item) => {
                    item.id = item._id;
                    item.categoryName = item.category.name;
                    item.createdOn = dateHelper.getDateAndTime(item.createdOn);
                    item.modifiedCount = 0;
                    item.errorMessage = null;
                    item.status = null;
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

    const handleOnChange = (e, index) => {
        try {
            const updatedGroceries = [...groceries];
            updatedGroceries[index].modifiedCount = e.target.value;
            updatedGroceries[index].errorMessage = null;
            updatedGroceries[index].status = null;
            setGroceries(updatedGroceries);
        } catch (e) {}
    };

    const updateInventoryFor = async (index) => {
        console.log("Updating inventory for...", index);
        try {
            let updatedGroceries = [...groceries];
            if (
                updatedGroceries[index].status === "success" ||
                !updatedGroceries[index].modifiedCount ||
                updatedGroceries[index].modifiedCount == 0
            )
                return;
            updatedGroceries[index].status = "loading";
            setGroceries(updatedGroceries);

            const groceryItem = groceries[index];
            const params = {
                id: groceryItem._id,
                itemCount: parseInt(groceryItem.modifiedCount),
            };
            const res = await axiosInstance.post(
                "/grocery/update-inventory",
                params
            );

            updatedGroceries = [...groceries];
            if (res.data?.status === "success") {
                updatedGroceries[index].status = "success";
                updatedGroceries[index].errorMessage = null;
            } else {
                updatedGroceries[index].status = "success";
                updatedGroceries[index].errorMessage = res.data.message;
            }
            setGroceries(updatedGroceries);
        } catch (ex) {
            const updatedGroceries = [...groceries];
            updatedGroceries[index].status = null;
            updatedGroceries[index].errorMessage = ex.response?.data?.message || ex.message;
            setGroceries(updatedGroceries);
        }
    };

    useEffect(() => {
        fetchGroceries();
    }, []);

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
                <Typography variant="body1" style={{ color: "red" }}>
                    {errorMessage}
                </Typography>
            </Grid>
        );
    }

    return (
        <>
            <Typography variant="h5" className="py-1">
                Update Inventory Stock
            </Typography>
            <TableContainer component={Paper} className="inventory-table">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Stock Count</TableCell>
                            <TableCell>Add/Remove Stock</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groceries.map((item, index) => {
                            return (
                                <TableRow>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.stockCount}</TableCell>
                                    <TableCell>
                                        <TextField
                                            label="Modifiy Stock Count by"
                                            name="name"
                                            type="number"
                                            inputMode="numeric"
                                            onChange={(e) =>
                                                handleOnChange(e, index)
                                            }
                                            value={item.modifiedCount}
                                            error={item.errorMessage}
                                            helperText={item.errorMessage}
                                            variant="filled"
                                            size="small"
                                            onBlur={() =>
                                                updateInventoryFor(index)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {item.status === "success" ? (
                                            <CloudDoneIcon color="success" />
                                        ) : item.status === "loading" ? (
                                            <CircularProgress size="1.5rem" />
                                        ) : (
                                            <BackupIcon
                                                color="info"
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    updateInventoryFor(index)
                                                }
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default UpdateInventory;
