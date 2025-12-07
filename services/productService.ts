import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '../firebaseConfig';

export interface Product {
    name: string;
    price: number;
    category: string;
    description: string;
    imageUrl: string;
    createdAt: any;
}

export const addProduct = async (
    name: string,
    price: string,
    category: string,
    description: string,
    imageUri: string
): Promise<string> => {
    try {
        // 1. Upload image to Firebase Storage
        const imageUrl = await uploadToCloudinary(imageUri);

        // 2. Add product to Firestore
        const productData: Product = {
            name,
            price: parseFloat(price),
            category,
            description,
            imageUrl,
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'products'), productData);
        return docRef.id;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

const uploadImage = async (uri: string): Promise<string> => {
    try {
        const storage = getStorage();
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Create unique filename
        const filename = `products/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const storageRef = ref(storage, filename);
        
        // Upload image
        await uploadBytes(storageRef, blob);
        
        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

const uploadToCloudinary = async (uri: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: "upload.jpg",
    } as any); 
    
    formData.append("upload_preset", "images_from_micro_ecommerce"); 
    
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dsnbjmnxn/image/upload",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.secure_url) {
      throw new Error("No secure URL returned from Cloudinary");
    }
    
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
