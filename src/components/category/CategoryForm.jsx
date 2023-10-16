import { useState } from "react";
import {
    Alert,
    Button,
    Container,
    Grid,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import axiosInstance from "../../network/axios-instance";

const CategoryForm = ({ onCloseDialog }) => {
    const [isLoading, setIsLoading] = useState(false);
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
    });

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        const updatedFormState = { ...formState };
        updatedFormState[name].value = value;
        updatedFormState[name].errorMessage = null;
        updateFormState(updatedFormState);
    };

    const handleFormSubmit = async () => {
        setFormErrorMessage(null);
        let hasErrors = true;
        const updatedFormState = { ...formState };
        if (!updatedFormState.name.value) {
            updatedFormState.name.errorMessage = "Name is required!";
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
                };

                const res = await axiosInstance.post("/category", params);
                if (res.data.status === "success") {
                    onCloseDialog(res.data.payload);
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

    return (
        <Container className="p-0">
            <Grid
                container
                justifyContent={"space-between"}
                alignItems="center"
                style={{ marginBottom: "1rem" }}
            >
                <Typography variant="h5">New Category</Typography>
                <IconButton
                    size="large"
                    color="inherit"
                    onClick={() => onCloseDialog()}
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
    );
};

export default CategoryForm;
