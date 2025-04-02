import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import "./FavoritesList.css";

const FavoritesList = () => {
    const { user } = useContext(AuthContext);
    const token = user?.token;
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFavorites = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/favorites/my-favorites", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites(response.data);
            setError(null);
        } catch (error) {
            console.error("Error al obtener los favoritos:", error);
            setError(
                error.response?.status === 403
                    ? "No tienes permisos para ver tus favoritos. Verifica tu sesión."
                    : "Error al obtener los favoritos"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [token]);

    const handleRemoveFavorite = async (productId) => {
        try {
            await axios.delete(`http://localhost:8080/favorites/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchFavorites();
        } catch (error) {
            console.error("Error al eliminar favorito:", error);
            setError("Error al eliminar el favorito");
        }
    };

    const handleViewDetails = (productId) => {
        navigate(`/details/${productId}`);
    };

    return (
        <div className="favorites-container">
            <h2>Mis Favoritos</h2>

            {loading ? (
                <p>Cargando favoritos...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : favorites.length > 0 ? (
                <div className="favorites-grid">
                    {favorites.map((fav) => (
                        <div key={fav.id} className="favorite-card">
                            <div className="favorite-image-container">
                                <img 
                                    src={fav.images?.[0]?.imageUrl || "https://via.placeholder.com/300"} 
                                    alt={fav.title || "Imagen del producto"} 
                                    className="favorite-image"
                                />
                            </div>
                            <div className="favorite-content">
                                <h3>{fav.title || "Título no disponible"}</h3>
                                <p className="favorite-location">{fav.location || "Ubicación no disponible"}</p>
                                <p className="favorite-description">{fav.shortDescription || "Descripción no disponible"}</p>
                                <div className="favorite-buttons">
                                    <button 
                                        onClick={() => handleViewDetails(fav.id)}
                                        className="view-details-button"
                                    >
                                        Ver Detalle
                                    </button>
                                    <button 
                                        onClick={() => handleRemoveFavorite(fav.id)}
                                        className="remove-favorite-button"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No tienes productos favoritos.</p>
            )}
        </div>
    );
};

export default FavoritesList;