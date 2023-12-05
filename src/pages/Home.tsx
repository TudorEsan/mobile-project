// screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { signOut } from "firebase/auth";
import { auth, firebase, db } from "../../firebase.config";
import withAuthProtection from "../hocs/withAuthProtection";
import { collection, doc, onSnapshot } from "firebase/firestore";

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleAddProduct = () => {
    navigation.navigate("AddProduct");
  };
  const [products, setProducts] = useState<any[]>([]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productsList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return data;
      });
      setProducts(productsList);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.productText}>My products:</Text>
      {products.map((product, index) => {
        const expiryDate = new Date(product.expiry_date);
        const formattedDate = expiryDate.toLocaleDateString();
        return (
          <View style={styles.productContainer} key={index}>
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDate}>{formattedDate}</Text>
            </View>
            <Text style={styles.productCategory}>{product.category}</Text>
          </View>
        );
      })}
      <TouchableOpacity
        style={styles.addProductButton}
        onPress={handleAddProduct}
      >
        <Text style={styles.addProductButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 15,
  },
  productText: {
    fontSize: 20,
  },
  addProductButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },

  addProductButtonText: {
    fontSize: 30,
    color: "white",
  },
  productContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    marginBottom: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productDate: {
    fontSize: 14,
    color: "#888",
  },
  productCategory: {
    fontSize: 16,
    color: "black",
    fontStyle: "italic",
  },
});
export default withAuthProtection(HomeScreen);