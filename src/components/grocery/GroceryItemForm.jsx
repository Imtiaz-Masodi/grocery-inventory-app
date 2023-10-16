import { useEffect, useState } from "react";
import {
    Alert,
    Autocomplete,
    Button,
    Card,
    Container,
    Dialog,
    Grid,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import axiosInstance from "../../network/axios-instance";
import CategoryForm from "../category/CategoryForm";

const GroceryItemForm = ({ categories, addNewCategory, onCloseDialog }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState(null);
    const [formState, updateFormState] = useState({
        name: {
            value: "",
            errorMessage: null,
        },
        description: {
            value: "",
            errorMessage: null,
        },
        price: {
            value: "",
            errorMessage: null,
        },
        category: {
            value: "",
            options: categories,
            selectedItem: null,
            errorMessage: null,
        },
        stockCount: {
            value: "",
            errorMessage: null,
        },
    });

    const handleOnChange = (event) => {
        const { name, value, selectedItem } = event.target;

        if (selectedItem && selectedItem._id === -1) {
            return setShowAddCategoryForm(true);
        }

        const updatedFormState = { ...formState };
        updatedFormState[name].value = value;
        updatedFormState[name].errorMessage = null;

        if (selectedItem) updatedFormState[name].selectedItem = selectedItem;

        updateFormState(updatedFormState);
    };

    const handleFormSubmit = async () => {
        setFormErrorMessage(null);
        let hasErrors = true;
        const updatedFormState = { ...formState };
        if (!updatedFormState.name.value) {
            updatedFormState.name.errorMessage = "Name is required!";
        } else if (
            !updatedFormState.price.value ||
            parseInt(updatedFormState.price.value) <= 0
        ) {
            updatedFormState.price.errorMessage =
                "Price should be greater than 0";
        } else if (
            !updatedFormState.stockCount.value ||
            parseInt(updatedFormState.stockCount.value) <= 0
        ) {
            updatedFormState.price.errorMessage =
                "Stock count should be greater than 0";
        } else {
            hasErrors = false;
        }

        if (hasErrors) {
            updateFormState(updatedFormState);
        } else {
            setIsLoading(true);
            try {
                const params = {
                    name: formState.name.value,
                    description: formState.description.value,
                    price: formState.price.value,
                    category: formState.category.value,
                    stockCount: formState.stockCount.value,
                };

                const res = await axiosInstance.post("/grocery/add", params);
                if (res.data.status === "success") {
                    onCloseDialog(true);
                } else {
                    setFormErrorMessage(res.data.message);
                }
            } catch (ex) {
                console.log(ex);
                setFormErrorMessage(ex.response?.data?.message || ex.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCategoryFormClose = (newCategoryItem = undefined) => {
        if (newCategoryItem && newCategoryItem._id) {
            addNewCategory(newCategoryItem);

            const updatedFormState = { ...formState };
            updatedFormState.category.value = newCategoryItem._id;
            updatedFormState.category.selectedItem = newCategoryItem;
            updateFormState(updatedFormState);
        }
        setShowAddCategoryForm(false);
    }

    useEffect(() => {
        const updatedFormState = { ...formState };
        updatedFormState.category.options = categories;
        updateFormState(updatedFormState);
    }, [categories]);

    return (
        <>
            <Container className="p-0">
                <Grid
                    container
                    justifyContent={"space-between"}
                    alignItems="center"
                    style={{ marginBottom: "1rem" }}
                >
                    <Typography variant="h5">Add Grocery Item</Typography>
                    <IconButton
                        size="large"
                        color="inherit"
                        onClick={onCloseDialog}
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                </Grid>
                <Grid container spacing="1rem">
                    {formErrorMessage && (
                        <Grid item xs={12}>
                            <Alert severity="error">{formErrorMessage}</Alert>
                        </Grid>
                    )}
                    <Grid item sm={12}>
                        <TextField
                            label="Name"
                            name="name"
                            onChange={handleOnChange}
                            value={formState.name.value}
                            error={formState.name.errorMessage}
                            helperText={formState.name.errorMessage}
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                    </Grid>
                    <Grid item sm={12}>
                        <TextField
                            label="Price"
                            name="price"
                            onChange={handleOnChange}
                            value={formState.price.value}
                            error={formState.price.errorMessage}
                            helperText={formState.price.errorMessage}
                            variant="outlined"
                            type="number"
                            inputMode="decimals"
                            size="small"
                            fullWidth
                        />
                    </Grid>
                    <Grid item sm={12}>
                        <TextField
                            label="Stock Count"
                            name="stockCount"
                            onChange={handleOnChange}
                            value={formState.stockCount.value}
                            error={formState.stockCount.errorMessage}
                            helperText={formState.stockCount.errorMessage}
                            variant="outlined"
                            type="number"
                            size="small"
                            fullWidth
                        />
                    </Grid>
                    <Grid item sm={12}>
                        <Autocomplete
                            disablePortal
                            options={formState.category.options}
                            getOptionLabel={(option) => option?.name || ""}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    label="Category"
                                />
                            )}
                            onChange={(_, selectedItem) => {
                                handleOnChange({
                                    target: {
                                        name: "category",
                                        value: selectedItem._id,
                                        selectedItem,
                                    },
                                });
                            }}
                            value={formState.category.selectedItem}
                            fullWidth
                        />
                    </Grid>
                    <Grid item sm={12}>
                        <TextField
                            label="Description"
                            name="description"
                            value={formState.description.value}
                            onChange={handleOnChange}
                            variant="outlined"
                            size="small"
                            rows={3}
                            multiline
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            disabled={isLoading}
                            style={{ marginTop: "1rem" }}
                            onClick={handleFormSubmit}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Container>

            {showAddCategoryForm && (
                <Dialog
                    open
                    onClose={handleCategoryFormClose}
                    maxWidth={"sm"}
                    PaperComponent="span"
                >
                    <Card className="p-2 br-1">
                        <CategoryForm onCloseDialog={handleCategoryFormClose} />
                    </Card>
                </Dialog>
            )}
        </>
    );
};

export default GroceryItemForm;
