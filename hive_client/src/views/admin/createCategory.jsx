import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import styles from "./createCategory.module.scss";
import { toast } from "react-toastify";
import axiosClient from "../../axios";

const CreateCategory = () => {
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState(null);

    const fetchCategories = async () => {
        try {
            const response = await axiosClient.get("/categories");
            setCategories(response.data.categories);
        } catch (error) {
            toast.error("Failed to fetch categories");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryName.trim()) {
            toast.error("Category name is required");
            return;
        }

        setIsLoading(true);
        try {
            await axiosClient.post("/categories", { name: categoryName });
            toast.success("Category created successfully!");
            setCategoryName("");
            fetchCategories();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to create category"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (categoryId) => {
        setIsDeletingId(categoryId);
        try {
            await axiosClient.delete(`/categories/${categoryId}`);
            toast.success("Category deleted successfully!");
            fetchCategories();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete category"
            );
        } finally {
            setIsDeletingId(null);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>
                    <PlusCircle className="inline-block mr-2 mb-1" size={32} />
                    Category Management
                </h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="categoryName" className={styles.label}>
                            Category Name
                        </label>
                        <input
                            id="categoryName"
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className={styles.input}
                            placeholder="Enter category name"
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create Category"}
                    </button>
                </form>

                <div className={styles.categoriesList}>
                    <button
                        className={styles.dropdownToggle}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <span>View Categories</span>
                        {isDropdownOpen ? (
                            <ChevronUp size={20} />
                        ) : (
                            <ChevronDown size={20} />
                        )}
                    </button>

                    {isDropdownOpen && (
                        <div className={styles.dropdown}>
                            {categories?.length === 0 ? (
                                <p className={styles.emptyMessage}>
                                    No categories found
                                </p>
                            ) : (
                                categories?.map((category) => (
                                    <div
                                        key={category.id}
                                        className={styles.categoryItem}
                                    >
                                        <span>{category.name}</span>
                                        <button
                                            onClick={() =>
                                                handleDelete(category.id)
                                            }
                                            className={styles.deleteBtn}
                                            disabled={
                                                isDeletingId === category.id
                                            }
                                        >
                                            <Trash2
                                                size={18}
                                                className={
                                                    isDeletingId === category.id
                                                        ? styles.spinning
                                                        : ""
                                                }
                                            />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateCategory;
