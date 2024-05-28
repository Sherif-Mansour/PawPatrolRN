const profileStructure = {
  uid: string, // User ID (unique identifier)
  name: string, // User's name
  email: string, // User's email
  photoURL: string, // URL of the user's profile picture
  bio: string, // User's bio or description
  createdAt: timestamp, // Timestamp when the profile was created
  updatedAt: timestamp, // Timestamp when the profile was last updated
  location: string, // User's location
  phoneNumber: string, // User's phone number
  serviceType: string, // Type of service offered or sought
  availability: string, // User's availability for service
  experience: string, // User's experience in the field
  description: string, // Description of the services offered or sought
  pricing: object, // Pricing details for the services
  certifications: array, // List of certifications obtained
  specializations: array, // List of specializations or skills
  petPreferences: array, // User's preferences regarding pets
  reviews: array, // List of reviews received by the user
  ratings: object, // Object containing overall ratings and possibly ratings breakdown by category
};

export default profileStructure;
