import { useEffect, useState } from "react";
import axiosInstance from "../../network/axios-instance";
import dateHelper from "../../helpers/dateHelper";
import { Container, Grid, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { RUPEE_SYMBOL } from "../../utilities/constants";

const InventoryHistory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [historyList, setHistoryList] = useState([]);

    useEffect(() => {
        fetchInventoryHistory();
    }, []);

    const fetchInventoryHistory = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get("/inventory");
            if (res.data.status === "success") {
                res.data.payload?.map((item) => {
                    item.id = item._id;
                    item.name = item.groceryItem?.name;
                    item.description = item.groceryItem?.description;
                    item.price = RUPEE_SYMBOL + item.groceryItem?.price;
                    item.quantityModified = item.quantityModified;
                    item.quantityThen = item.quantityThen;
                    item.newQuantity =
                        item.quantityModified + item.quantityThen;
                    item.date = dateHelper.getDateAndTime(item.date);
                    return item;
                });
                setHistoryList(res.data.payload);
            }
        } catch (ex) {
            console.error(ex);
        } finally {
            setIsLoading(false);
        }
    };

    const tableColumns = [
        { field: "name", headerName: "Name", flex: 15 },
        { field: "description", headerName: "Description", flex: 20 },
        { field: "price", headerName: "Price", flex: 10 },
        { field: "quantityThen", headerName: "Old Stock Count", flex: 10 },
        {
            field: "quantityModified",
            headerName: "Quantity Modified",
            flex: 10,
        },
        { field: "newQuantity", headerName: "Stock Count", flex: 10 },
        { field: "date", headerName: "Date", flex: 15 },
    ];

    return (
        <Container>
            {historyList && historyList.length > 0 ? (
                <>
                    <Grid container alignItems="center">
                        <Grid item xs>
                            <Typography variant="h5" className="py-1">
                                Inventory History
                            </Typography>
                        </Grid>
                    </Grid>
                    <DataGrid
                        rows={historyList}
                        columns={tableColumns}
                        pageSizeOptions={[10, 25, 50]}
                        // paginationModel={{page: 0, pageSize: 10}}
                    />
                </>
            ) : (
                <></>
            )}
        </Container>
    );
};

export default InventoryHistory;
