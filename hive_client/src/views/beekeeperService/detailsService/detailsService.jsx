import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Calendar, MapPin, User } from "lucide-react";
import styles from "./detailsService.module.scss";
import axiosClient from "../../../axios";
import ReservationModal from "../../../components/reservationModal/reservationModal";
import CustomLoader from "../../../components/loader/loader";
import StateContext from "../../../contexts/authcontext";

const DetailsService = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { authData } = useContext(StateContext);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axiosClient.get(`/services/${id}`);
                setService(response.data.service);
            } catch (err) {
                setError("Failed to load service details");
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!rating || !comment.trim()) return;

        setSubmitting(true);
        try {
            await axiosClient.post(`/recensions`, {
                stars: rating,
                message: comment.trim(),
                service_id: id,
            });

            const response = await axiosClient.get(`/services/${id}`);
            setService(response.data.service);

            setComment("");
            setRating(0);
        } catch (err) {
            setError("Failed to submit comment. Please try again.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) return <CustomLoader />;
    if (error) return <div>{error}</div>;
    if (!service) return <div>Service not found</div>;

    return (
        <div className={styles.serviceDetails}>
            <div className={styles.card}>
                {service.image_url && (
                    <img
                        src={service.image_url}
                        alt={`${service.categoryservice.name} service`}
                        className={styles.serviceImage}
                    />
                )}

                <div className={styles.serviceInfo}>
                    <h1>{service.categoryservice.name}</h1>
                    <p className={styles.price}>${service.price}</p>
                    <p className={styles.details}>{service.details}</p>
                    <p>Provided by: {service.user.name}</p>

                    {authData.user.id != service.user_id ? (
                        <button
                            className={styles.reserveButton}
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Calendar className="inline-block mr-2" size={20} />
                            Reserve Now
                        </button>
                    ) : (
                        ""
                    )}
                </div>
            </div>

            <div className={styles.recensionsSection}>
                <h2>Reviews</h2>
                <div className={styles.recensionsList}>
                    {service.recensions?.map((recension) => (
                        <div key={recension.id} className={styles.recension}>
                            <div className={styles.recensionHeader}>
                                <div className={styles.userInfo}>
                                    <User
                                        size={20}
                                        className={styles.userIcon}
                                    />
                                    <span className={styles.userName}>
                                        {recension.user.name}
                                    </span>
                                    {recension.user.beekeeper && (
                                        <div className={styles.beekeeperInfo}>
                                            <MapPin size={16} />
                                            <span>
                                                {recension.user.beekeeper.city},{" "}
                                                {
                                                    recension.user.beekeeper
                                                        .location
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.recensionMeta}>
                                    <div className={styles.stars}>
                                        {[...Array(recension.stars)].map(
                                            (_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    fill="currentColor"
                                                    className={styles.starIcon}
                                                />
                                            )
                                        )}
                                    </div>
                                    <span className={styles.date}>
                                        {formatDate(recension.created_at)}
                                    </span>
                                </div>
                            </div>
                            <p className={styles.recensionMessage}>
                                {recension.message}
                            </p>
                        </div>
                    ))}
                </div>

                {authData.user.id != service.user_id ? (
                    <div className={styles.addRecension}>
                        <h3>Add Your Review</h3>
                        <form
                            className={styles.recensionForm}
                            onSubmit={handleSubmitComment}
                        >
                            <div className={styles.starRating}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={
                                            star <= rating ? styles.active : ""
                                        }
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            fill={
                                                star <= rating
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                            size={24}
                                        />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience with this service..."
                                required
                            />

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={
                                    submitting || !rating || !comment.trim()
                                }
                            >
                                {submitting ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    </div>
                ) : (
                    "   "
                )}
            </div>

            <ReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                serviceId={service.id}
            />
        </div>
    );
};

export default DetailsService;
