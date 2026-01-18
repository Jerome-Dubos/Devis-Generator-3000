/**
 * Gestion des profils d'entreprise émettrice de devis
 * Stockage dans localStorage
 */

const STORAGE_KEY = 'devis-generator-sender-profiles';

/**
 * Récupère tous les profils sauvegardés
 * @returns {Array} Liste des profils
 */
export const getAllProfiles = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Erreur lors de la récupération des profils:', error);
    return [];
  }
};

/**
 * Sauvegarde un nouveau profil ou met à jour un profil existant
 * @param {Object} profile - Profil à sauvegarder (doit contenir id, name, et les données sender)
 * @returns {Object} Profil sauvegardé
 */
export const saveProfile = (profile) => {
  try {
    const profiles = getAllProfiles();
    const profileIndex = profiles.findIndex((p) => p.id === profile.id);

    const profileToSave = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };

    if (profileIndex >= 0) {
      // Mise à jour d'un profil existant
      profiles[profileIndex] = profileToSave;
    } else {
      // Nouveau profil
      profileToSave.createdAt = new Date().toISOString();
      if (!profileToSave.id) {
        profileToSave.id = `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      profiles.push(profileToSave);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return profileToSave;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du profil:', error);
    throw error;
  }
};

/**
 * Supprime un profil
 * @param {string} profileId - ID du profil à supprimer
 */
export const deleteProfile = (profileId) => {
  try {
    const profiles = getAllProfiles();
    const filteredProfiles = profiles.filter((p) => p.id !== profileId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProfiles));
  } catch (error) {
    console.error('Erreur lors de la suppression du profil:', error);
    throw error;
  }
};

/**
 * Récupère un profil par son ID
 * @param {string} profileId - ID du profil
 * @returns {Object|null} Profil trouvé ou null
 */
export const getProfileById = (profileId) => {
  try {
    const profiles = getAllProfiles();
    return profiles.find((p) => p.id === profileId) || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return null;
  }
};

/**
 * Crée un profil à partir des données sender actuelles
 * @param {Object} senderData - Données sender du devis
 * @param {string} profileName - Nom du profil
 * @returns {Object} Profil créé
 */
export const createProfileFromSender = (senderData, profileName) => {
  // Créer une copie des données sender sans le logo (on garde seulement logoUrl)
  const profileData = {
    ...senderData,
    logo: null, // Ne pas sauvegarder le fichier, seulement l'URL si elle existe
  };

  return {
    name: profileName,
    sender: profileData,
  };
};
