import { TroforteProduct, troforteProducts } from "@/constants/Products";
import React, { useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MarketplaceScreen() {
  const [selectedCategory, setSelectedCategory] = useState<"All" | "CRF" | "M" | "Liquid">("All");
  const [cart, setCart] = useState<{ product: TroforteProduct; qty: number }[]>([]);

  const filteredProducts =
    selectedCategory === "All"
      ? troforteProducts
      : troforteProducts.filter((p) => p.category === selectedCategory);

  const addToCart = (product: TroforteProduct) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.name === product.name);
      if (existing) {
        return prev.map((c) =>
          c.product.name === product.name ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (product: TroforteProduct) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.product.name === product.name ? { ...c, qty: c.qty - 1 } : c
        )
        .filter((c) => c.qty > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const categories: ("All" | "CRF" | "M" | "Liquid")[] = ["All", "CRF", "M", "Liquid"];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <Text style={styles.headerSubtitle}>
          {cart.length} item{cart.length !== 1 && "s"} in cart
        </Text>
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isActive = selectedCategory === item;
            return (
              <TouchableOpacity
                style={[styles.filterTab, isActive && styles.activeFilterTab]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ padding: 20, paddingBottom: cart.length > 0 ? 200 : 20 }}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Cart Section */}
      {cart.length > 0 && (
        <View style={styles.cartContainer}>
          <ScrollView>
            {cart.map((item) => (
              <View style={styles.cartItem} key={item.product.name}>
                <Image source={{ uri: item.product.imageUrl }} style={styles.cartImage} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cartName}>{item.product.name}</Text>
                  <Text style={styles.cartPrice}>
                    ${item.product.price.toFixed(2)} x {item.qty}
                  </Text>
                </View>
                <View style={styles.cartActions}>
                  <TouchableOpacity onPress={() => removeFromCart(item.product)} style={styles.qtyButton}>
                    <Text style={styles.qtyButtonText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => addToCart(item.product)} style={styles.qtyButton}>
                    <Text style={styles.qtyButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.cartFooter}>
            <Text style={styles.totalText}>Total: ${cartTotal.toFixed(2)}</Text>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#010409" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    textShadowColor: "#00D084",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerSubtitle: { fontSize: 16, color: "#94A3B8", marginTop: 4 },
  filterContainer: { paddingHorizontal: 20, paddingVertical: 12 },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161B22",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  activeFilterTab: { backgroundColor: "#00D084", borderColor: "#00D084" },
  filterText: { fontSize: 12, fontWeight: "600", color: "#94A3B8" },
  activeFilterText: { color: "#FFFFFF" },
  productCard: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  productImage: { width: "100%", height: 150, borderRadius: 12, marginBottom: 12, backgroundColor: "#0D1117" },
  productName: { fontSize: 16, fontWeight: "600", color: "#FFFFFF", marginBottom: 4 },
  productPrice: { fontSize: 14, color: "#00D084", marginBottom: 8 },
  addButton: { backgroundColor: "#00D084", borderRadius: 8, paddingVertical: 8, alignItems: "center" },
  addButtonText: { color: "#FFFFFF", fontWeight: "600" },

  // Cart Styles
  cartContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0D1117",
    borderTopWidth: 1,
    borderTopColor: "#21262D",
    maxHeight: 250,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cartImage: { width: 40, height: 40, borderRadius: 8, marginRight: 10, backgroundColor: "#161B22" },
  cartName: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  cartPrice: { color: "#94A3B8", fontSize: 12 },
  cartActions: { flexDirection: "row" },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#161B22",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#21262D",
  },
  qtyButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  cartFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#21262D",
  },
  totalText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  checkoutButton: { backgroundColor: "#00D084", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  checkoutButtonText: { color: "#FFFFFF", fontWeight: "600" },
});
