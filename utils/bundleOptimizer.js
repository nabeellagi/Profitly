/**
 * Compute optimized bundles based on profit margins and bottom-up discount model.
 * @param {Array} items - Array of products.
 * @param {number} k - Sensitivity factor
 * @returns {Array} bundles - List of optimized bundle objects
 */

export function generateOptimizedBundles(items, k = 0.5) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Invalid or empty items array.");
  }

  const products = items.map((item) => ({
    ...item,
    margin: Number(((item.profit / item.budget) * 100).toFixed(2)),
  }));

  products.sort((a, b) => a.margin - b.margin);

  const bundles = [];
  const n = products.length;
  const half = Math.floor(n / 2);

  for (let i = 0; i < half; i++) {
    const low = products[i];
    const high = products[n - i - 1];

    const bundleItems = [low.name, high.name];
    const totalPrice = low.price + high.price;
    const totalProfit = low.profit + high.profit;
    const avgMargin = Number(((low.margin + high.margin) / 2).toFixed(2));

    bundles.push({
      bundle: bundleItems,
      totalPrice,
      totalProfit,
      avgMargin,
    });
  }

  if (n % 2 !== 0) {
    const leftover = products[half];
    bundles.push({
      bundle: [leftover.name],
      totalPrice: leftover.price,
      totalProfit: leftover.profit,
      avgMargin: leftover.margin,
    });
  }

  const margins = products.map((p) => p.margin);
  const mean = margins.reduce((sum, m) => sum + m, 0) / margins.length;
  const variance =
    margins.reduce((sum, m) => sum + Math.pow(m - mean, 2), 0) / margins.length;
  const stdDev = Math.sqrt(variance);

  const discountRate = Number((k * stdDev).toFixed(2));

  const finalBundles = bundles.map((b) => {
    const discountValue = Number(
      (b.totalPrice * (discountRate / 100)).toFixed(2)
    );
    const discountedPrice = Number((b.totalPrice - discountValue).toFixed(2));

    const totalCost = b.totalPrice - b.totalProfit;
    const profitAfterDiscount = discountedPrice - totalCost;
    const marginAfterDiscount = Number(
      ((profitAfterDiscount / discountedPrice) * 100).toFixed(2)
    );

    return {
      ...b,
      discountRate: `${discountRate}%`,
      discountedPrice,
      avgMargin: marginAfterDiscount, // update margin after discount
    };
  });

  return finalBundles;
}
