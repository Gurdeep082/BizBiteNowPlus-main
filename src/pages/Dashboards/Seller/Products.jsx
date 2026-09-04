import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import {
  Search,
  Plus,
  FileText,
  Pencil,
  Trash2,
  Filter,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Package,
  Loader2,
} from "lucide-react";

// UI Components
import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Card from "../../../components/UI/Card";
import Badge from "../../../components/UI/Badge";
import EmptyState from "../../../components/UI/EmptyState";
import Toggle from "../../../components/UI/Toggle";

import ProductDrawer from "../../../components/products/ProductDrawer";
import DeleteProductModal from "../../../components/products/DeleteProductModal";
import useProductStore from "../../../store/productStore";
import { notifySuccess, notifyError, getApiErrorMessage } from "../../../utils/toast";

function ProductSkeletonCard() {
  return (
    <Card padding="p-0" className="overflow-hidden bg-white">
      <div className="h-44 w-full animate-pulse bg-slate-100" />
      <div className="p-4 space-y-3">
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="h-5 w-14 animate-pulse rounded bg-slate-100" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="h-8 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-8 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    </Card>
  );
}

function traceShapePath(ctx, shape, size) {
  const c = size / 2;
  ctx.beginPath();
  if (shape === "hexagon") {
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const px = c + c * Math.cos(angle);
      const py = c + c * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else if (shape === "diamond") {
    ctx.moveTo(c, 0);
    ctx.lineTo(size, c);
    ctx.lineTo(c, size);
    ctx.lineTo(0, c);
    ctx.closePath();
  } else if (shape === "squircle") {
    const r = size * 0.3;
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
  } else {
    ctx.arc(c, c, c, 0, Math.PI * 2);
  }
}

async function loadShapedImage(url, shape = "circle", size = 260) {
  if (!url) return null;
  try {
    const res = await fetch(url, { mode: "cors" });
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    traceShapePath(ctx, shape, size);
    ctx.closePath();
    ctx.clip();

    const scale = Math.max(size / bitmap.width, size / bitmap.height);
    const w = bitmap.width * scale;
    const h = bitmap.height * scale;
    ctx.drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h);

    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

const GOLD = [199, 161, 74];
const GOLD_DEEP = [156, 122, 46];
const DARK_BG = [17, 17, 19];
const TEXTURE_LINE = [28, 28, 31];
const LIGHT_TEXT = [232, 230, 224];
const MUTED_TEXT = [160, 156, 148];

function hexToRgb(hex, fallback = GOLD) {
  if (!hex) return fallback;
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return fallback;
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

async function fetchStoreInfo(sellerId) {
  if (!sellerId) return null;
  try {
    const res = await fetch(`/api/customer/store/${sellerId}`);
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

function drawShapeFill(doc, shape, cx, cy, r, color) {
  doc.setFillColor(...color);
  if (shape === "squircle") {
    doc.roundedRect(cx - r, cy - r, r * 2, r * 2, r * 0.55, r * 0.55, "F");
  } else {
    doc.circle(cx, cy, r, "F");
  }
}

function drawShapedMedallion(doc, dataUrl, shape, cx, cy, r, brand = GOLD) {
  drawShapeFill(doc, shape, cx, cy, r + 7, GOLD_DEEP);
  drawShapeFill(doc, shape, cx, cy, r + 4, DARK_BG);
  drawShapeFill(doc, shape, cx, cy, r + 1.5, brand);
  if (dataUrl) doc.addImage(dataUrl, "PNG", cx - r, cy - r, r * 2, r * 2);
}

function drawRibbon(doc, text, x, y, width, height, brand) {
  const notch = height / 2;
  doc.setFillColor(...GOLD_DEEP);
  doc.rect(x, y + height - 3, width - notch, 3, "F");
  doc.triangle(x + width - notch, y, x + width, y + height / 2, x + width - notch, y + height, "F");
  doc.setFillColor(...brand);
  doc.rect(x, y, width - notch, height - 3, "F");
  doc.triangle(x + width - notch, y, x + width - 3, y + height / 2, x + width - notch, y + height - 3, "F");
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(13);
  doc.setTextColor(18, 16, 12);
  doc.text(text, x + 14, y + (height - 3) / 2 + 4.5);
}

async function buildMenuPdf(productList, storeInfo) {
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 42;

  const profile = storeInfo?.store_profile || {};
  const contact = storeInfo?.contact_info || {};
  const storeName = profile.store_name || storeInfo?.business_name || "Our Restaurant";
  const tagline = profile.tagline || "";
  const addressLine = [contact.address, contact.city, contact.state].filter(Boolean).join(", ");
  const brand = GOLD;

  const grouped = {};
  productList.forEach((p) => {
    const cat = p.category?.trim() || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });
  const categories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  const heroUrls = Array.from(new Set(productList.map((p) => p.image).filter(Boolean))).slice(0, 3);
  const [logoImg, ...heroImgs] = await Promise.all([
    loadShapedImage(profile.logo, "squircle"),
    ...heroUrls.map((u) => loadShapedImage(u, "circle")),
  ]);

  const titleFont = "times";
  const titleStyle = "bolditalic";
  const scriptFont = "times";
  const scriptStyle = "italic";

  const drawPageBg = () => {
    doc.setFillColor(...DARK_BG);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setDrawColor(...TEXTURE_LINE);
    doc.setLineWidth(0.5);
    const spacing = 24;
    for (let i = -pageHeight; i < pageWidth + pageHeight; i += spacing) {
      doc.line(i, 0, i + pageHeight, pageHeight);
    }

    doc.setDrawColor(...GOLD_DEEP);
    doc.setLineWidth(1.4);
    doc.rect(16, 16, pageWidth - 32, pageHeight - 32);
    doc.setDrawColor(...brand);
    doc.setLineWidth(0.6);
    doc.rect(21, 21, pageWidth - 42, pageHeight - 42);
  };

  const drawTitleBlock = () => {
    const cx = pageWidth / 2;

    doc.setFont(scriptFont, scriptStyle);
    doc.setFontSize(16);
    doc.setTextColor(...brand);
    doc.text("~ Est. with Love ~", cx, 54, { align: "center" });

    doc.setFont(titleFont, titleStyle);
    doc.setFontSize(30);
    doc.setTextColor(255, 255, 255);
    if (typeof doc.setCharSpace === "function") doc.setCharSpace(1.4);
    doc.text(storeName.toUpperCase(), cx, 84, { align: "center" });
    if (typeof doc.setCharSpace === "function") doc.setCharSpace(0);

    doc.setDrawColor(...brand);
    doc.setLineWidth(1.4);
    doc.line(cx - 100, 96, cx + 100, 96);

    doc.setFont(scriptFont, scriptStyle);
    doc.setFontSize(15);
    doc.setTextColor(...MUTED_TEXT);
    if (tagline) doc.text(tagline, cx, 116, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED_TEXT);
    const contactBits = [addressLine, contact.primary_phone].filter(Boolean).join("   |   ");
    if (contactBits) doc.text(contactBits, cx, 130, { align: "center" });

    doc.setFillColor(...brand);
    for (let i = -2; i <= 2; i++) {
      doc.circle(cx + i * 14, 142, 2.2, "F");
    }

    const leftCluster = [
      { img: logoImg, shape: "squircle", cx: margin + 42, cy: 64, r: 34 },
      { img: heroImgs[0], shape: "circle", cx: margin + 156, cy: 64, r: 28 },
    ];
    const rightCluster = [
      { img: heroImgs[1], shape: "circle", cx: pageWidth - margin - 156, cy: 64, r: 28 },
      { img: heroImgs[2], shape: "squircle", cx: pageWidth - margin - 42, cy: 64, r: 34 },
    ];

    [...leftCluster, ...rightCluster].forEach(({ img, shape, cx: mx, cy: my, r }) => {
      if (img) drawShapedMedallion(doc, img, shape, mx, my, r, brand);
    });
  };

  const colGap = 26;
  const colWidth = (pageWidth - margin * 2 - colGap * 2) / 3;
  const colX = [margin, margin + colWidth + colGap, margin + (colWidth + colGap) * 2];
  const bottomLimit = pageHeight - margin - 10;

  let colIndex = 0;
  let colY = [0, 0, 0];
  let pageNum = 1;

  const startNewPage = (isFirst) => {
    if (!isFirst) doc.addPage();
    drawPageBg();
    const topY = isFirst ? 168 : margin + 10;
    if (isFirst) drawTitleBlock();
    colY = [topY, topY, topY];
    colIndex = 0;
    pageNum += 1;
  };

  startNewPage(true);

  const nextColumn = () => {
    colIndex = (colIndex + 1) % 3;
    if (colIndex === 0) startNewPage(false);
  };

  categories.forEach((cat) => {
    const items = grouped[cat];
    const ribbonH = 26;

    if (colY[colIndex] + ribbonH > bottomLimit) nextColumn();

    drawRibbon(doc, cat, colX[colIndex], colY[colIndex], colWidth, ribbonH, brand);
    colY[colIndex] += ribbonH + 16;

    items.forEach((product) => {
      const isAvailable = product.is_available !== false && product.available !== false;
      const desc = (product.description || "").trim();
      const descLines = desc ? doc.splitTextToSize(desc, colWidth - 70) : [];
      const usedDescLines = descLines.slice(0, 2);
      const variants = product.variants || [];
      const addons = product.addons || [];
      const itemH =
        15 +
        usedDescLines.length * 11 +
        variants.length * 11 +
        addons.length * 11 +
        (isAvailable ? 0 : 11) +
        10;

      if (colY[colIndex] + itemH > bottomLimit) {
        nextColumn();
        drawRibbon(doc, `${cat} (Continued)`, colX[colIndex], colY[colIndex], colWidth, ribbonH, brand);
        colY[colIndex] += ribbonH + 16;
      }

      const x = colX[colIndex];
      let y = colY[colIndex];

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...brand);
      const name = doc.splitTextToSize(product.name || "Unnamed Item", colWidth - 55)[0];
      doc.text(name, x, y);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...brand);
      const priceText = `Rs. ${Number(product.price ?? 0).toFixed(0)}`;
      doc.text(priceText, x + colWidth, y, { align: "right" });
      y += 13;

      if (usedDescLines.length) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...LIGHT_TEXT);
        usedDescLines.forEach((line) => {
          doc.text(line, x, y);
          y += 11;
        });
      }

      if (variants.length) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(...MUTED_TEXT);
        variants.forEach((v) => {
          const vPrice = v.offer_price ?? v.price_delta ?? v.price ?? 0;
          const line = `${v.name}: Rs. ${Number(vPrice).toFixed(0)}`;
          doc.text(`•  ${line}`, x + 4, y);
          y += 11;
        });
      }

      if (addons.length) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(...MUTED_TEXT);
        addons.forEach((a) => {
          const line = `${a.name} (+Rs. ${Number(a.price ?? 0).toFixed(0)})`;
          doc.text(`+  ${line}`, x + 4, y);
          y += 11;
        });
      }

      if (!isAvailable) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.5);
        doc.setTextColor(220, 90, 90);
        doc.text("Currently unavailable", x, y);
        y += 11;
      }

      colY[colIndex] = y + 10;
    });

    colY[colIndex] += 8;
  });

  const closingImg = heroImgs[heroImgs.length - 1] || heroImgs[0];
  if (closingImg) {
    drawShapedMedallion(doc, closingImg, "circle", pageWidth - margin - 40, pageHeight - margin - 40, 26, brand);
  }

  doc.save("menu.pdf");
}

export default function Products() {
  const navigate = useNavigate();

  const {
    products: productList = [],
    loading,
    error,
    fetchDashboardProducts,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("Newest First");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [generatingMenu, setGeneratingMenu] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDashboardProducts()
      .catch(() => { })
      .finally(() => setInitialLoaded(true));
  }, [fetchDashboardProducts]);

  const productStats = useMemo(() => {
    const total = productList.length;
    const active = productList.filter((p) => p.available === true || p.is_available === true).length;
    const outOfStock = productList.filter((p) => p.available === false || p.is_available === false).length;
    return { totalProducts: total, activeProducts: active, outOfStock };
  }, [productList]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(productList.map((p) => p.category).filter(Boolean));
    return ["All Categories", ...Array.from(cats)];
  }, [productList]);

  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.sku?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === "All Categories" || product.category === category;

      const isAvailable = product.available === true || product.is_available === true;

      let matchesTab = true;
      if (activeTab === "Active") matchesTab = isAvailable;
      if (activeTab === "Out of Stock") matchesTab = !isAvailable;

      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [productList, search, category, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleView = (product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    navigate("/seller/products/add");
  };

  const handleEdit = (product) => {
    navigate(`/seller/products/edit/${product._id || product.id}`);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleToggleAvailability = async (product) => {
    const id = product._id || product.id;
    const wasAvailable = product.available === true || product.is_available === true;
    const nextAvailable = !wasAvailable;

    setTogglingId(id);
    try {
      const isVeg = product.isVeg ?? product.is_veg ?? true;
      const fd = new FormData();
      fd.append("name", product.name || "");
      fd.append("description", product.description || "");
      fd.append("category", product.category || "");
      fd.append("price", Number(product.price) || 0);
      fd.append("stock", Number(product.stock || 0));
      fd.append("is_available", nextAvailable);
      fd.append("available", nextAvailable);
      fd.append("featured", product.featured || false);
      fd.append("combo", product.combo || false);
      fd.append("delivery", product.delivery ?? true);

      const sku = product.sku || product.sku_code || product.skuNumber;
      if (sku) {
        fd.append("sku", sku);
        fd.append("sku_code", sku);
      }

      fd.append("isVeg", isVeg);
      fd.append("is_veg", isVeg);
      fd.append("foodType", product.foodType || (isVeg ? "Veg" : "Non-Veg"));
      fd.append("rating", product.rating ?? 4.5);
      fd.append("variants", JSON.stringify(product.variants || []));
      fd.append("addons", JSON.stringify(product.addons || []));

      await updateProduct(id, fd);
      notifySuccess(nextAvailable ? "Item is now available" : "Item hidden from menu");
    } catch (err) {
      notifyError(getApiErrorMessage(err, "Couldn't update availability — try again"));
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    setDeleting(true);
    try {
      await deleteProduct(selectedProduct._id || selectedProduct.id);
      setDeleteOpen(false);
      setSelectedProduct(null);
      notifySuccess("Product deleted");
    } catch (err) {
      notifyError(getApiErrorMessage(err, "Couldn't delete the product — try again"));
    } finally {
      setDeleting(false);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const importedProducts = XLSX.utils.sheet_to_json(worksheet);

        if (!importedProducts.length) return alert("No products found in Excel file.");

        let successCount = 0;
        for (const item of importedProducts) {
          try {
            const formData = new FormData();
            formData.append("name", item.Name || "");
            formData.append("category", item.Category || "");
            formData.append("price", Number(item.Price) || 0);
            formData.append("stock", Number(item.Stock) || 0);
            formData.append("is_available", String(item.Available).toLowerCase() === "true");
            if (item.SKU) formData.append("sku", item.SKU);
            await useProductStore.getState().addProduct(formData);
            successCount++;
          } catch { }
        }
        alert(`${successCount} products imported successfully.`);
      } catch {
        alert("Invalid Excel file.");
      }
      event.target.value = "";
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadMenu = async () => {
    if (!productList.length) {
      alert("No products to include in the menu yet. Add a product first.");
      return;
    }
    setGeneratingMenu(true);
    try {
      const sellerId = productList[0]?.seller_id;
      const storeInfo = await fetchStoreInfo(sellerId);
      await buildMenuPdf(productList, storeInfo);
    } catch (err) {
      alert("Unable to generate menu PDF. Please try again.");
    } finally {
      setGeneratingMenu(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 pb-12 font-sans"
    >
      <div className="mb-6 space-y-3">
        <div>
          <Typography variant="h3">Product Management</Typography>
          <Typography variant="p" className="mt-0.5">
            Manage your menu items, prices and availability
          </Typography>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={16} />}
              className="!py-2.5 !text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadMenu}
              disabled={generatingMenu}
              className="!h-11 sm:!w-auto !w-full"
              title="Download a PDF with your whole menu, images and prices"
            >
              {generatingMenu ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
              {generatingMenu ? "Generating..." : "Download Menu"}
            </Button>

            <Button
              variant="primary"
              onClick={handleAdd}
              className="!h-11 sm:!w-auto !w-full"
            >
              <Plus size={18} /> Add Product
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-2.5 sm:gap-4 sm:grid-cols-3">
        <Card padding="p-4" className="relative overflow-hidden border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
          <svg
            className="absolute -right-4 -bottom-4 h-24 w-24 sm:h-28 sm:w-28 text-emerald-600 opacity-[0.09]"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle cx="62" cy="55" r="34" fill="currentColor" opacity="0.35" />
            <path
              d="M40 62 L52 40 L62 54 L72 36"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="40" cy="62" r="3.2" fill="currentColor" />
            <circle cx="52" cy="40" r="3.2" fill="currentColor" />
            <circle cx="62" cy="54" r="3.2" fill="currentColor" />
            <circle cx="72" cy="36" r="3.2" fill="currentColor" />
          </svg>
          <div className="relative flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3.5 text-center sm:text-left">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
              <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <Typography variant="small" weight="bold" color="text-emerald-700" className="text-[10px] sm:text-xs">Total Products</Typography>
              <Typography variant="h3" className="mt-0.5">{productStats.totalProducts}</Typography>
            </div>
          </div>
        </Card>

        <Card padding="p-4" className="relative overflow-hidden border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
          <svg
            className="absolute -right-4 -bottom-4 h-24 w-24 sm:h-28 sm:w-28 text-emerald-600 opacity-[0.09]"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle cx="60" cy="52" r="32" fill="currentColor" opacity="0.35" />
            <path
              d="M44 54 L54 64 L76 38"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="relative flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3.5 text-center sm:text-left">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
              <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <Typography variant="small" weight="bold" color="text-emerald-700" className="text-[10px] sm:text-xs">Active Products</Typography>
              <Typography variant="h3" className="mt-0.5">{productStats.activeProducts}</Typography>
            </div>
          </div>
        </Card>

        <Card padding="p-4" className="relative overflow-hidden border-rose-100 bg-gradient-to-br from-rose-50 to-white">
          <svg
            className="absolute -right-4 -bottom-4 h-24 w-24 sm:h-28 sm:w-28 text-rose-500 opacity-[0.09]"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle cx="60" cy="52" r="32" fill="currentColor" opacity="0.35" />
            <path
              d="M48 42 L72 62 M72 42 L48 62"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
          <div className="relative flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3.5 text-center sm:text-left">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-500 text-white shadow-sm shadow-rose-500/30">
              <XCircle size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <Typography variant="small" weight="bold" color="text-rose-600" className="text-[10px] sm:text-xs">Out of Stock</Typography>
              <Typography variant="h3" className="mt-0.5">{productStats.outOfStock}</Typography>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-4 flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-slate-200 pb-3">
        {["All", "Active", "Out of Stock"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "primary" : "outline"}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`!h-9 !px-4 !rounded-xl !text-xs ${activeTab !== tab ? "!border-0 hover:!bg-slate-100 !text-slate-600" : ""}`}
          >
            {tab === "All" ? "All Products" : tab}
          </Button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white py-2 px-3.5 text-xs font-medium text-slate-700 shadow-sm focus:outline-none focus:border-[#1A4D2E] focus:ring-2 focus:ring-[#1A4D2E]/20"
        >
          {uniqueCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none focus:border-[#1A4D2E] focus:ring-2 focus:ring-[#1A4D2E]/20"
        >
          <option value="Newest First">Newest First</option>
          <option value="Price: Low to High">Price: Low to High</option>
          <option value="Price: High to Low">Price: High to Low</option>
        </select>

        <Button variant="outline" className="!h-[34px] !px-3 !text-xs !bg-white">
          <Filter size={14} /> Filter
        </Button>
      </div>

      {!initialLoaded ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <ProductSkeletonCard key={i} />
          ))}
        </div>
      ) : paginatedProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Try adjusting your filters or add a new product."
          primaryAction={{ label: "Add Product", onClick: handleAdd }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paginatedProducts.map((product) => {
            const isVeg = product.isVeg ?? product.is_veg ?? true;
            const isAvailable = product.available === true || product.is_available === true;
            const id = product._id || product.id;
            const isToggling = togglingId === id;

            return (
              <Card
                key={id}
                padding="p-0"
                hover={true}
                onClick={() => handleView(product)}
                className="group relative overflow-hidden"
              >
                {isToggling && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
                    <Loader2 size={22} className="animate-spin text-emerald-600" />
                  </div>
                )}

                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <Badge
                    status={isVeg ? "success" : "danger"}
                    size="sm"
                    className="absolute left-3 top-3 !bg-white/95 backdrop-blur-sm shadow-sm"
                  >
                    <div className={`h-2.5 w-2.5 mr-1.5 rounded-full ${isVeg ? "bg-emerald-600" : "bg-rose-600"}`} />
                    {isVeg ? "Veg" : "Non-Veg"}
                  </Badge>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Typography variant="h6" className="line-clamp-1">{product.name}</Typography>
                      <Typography variant="small" className="mt-0.5">{product.category || "Beverage"}</Typography>
                    </div>
                    <Package size={16} className="text-slate-400 shrink-0 mt-1" />
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div>
                      <Typography variant="small" weight="bold" className="uppercase text-[10px] text-slate-400">Price</Typography>
                      <Typography variant="h5" weight="bold">₹{product.price}</Typography>
                    </div>

                    <div
                      onClick={(e) => { e.stopPropagation(); handleToggleAvailability(product); }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Badge status={isAvailable ? "in stock" : "out of stock"} size="sm">
                        {isAvailable ? "Available" : "Out of Stock"}
                      </Badge>
                      <Toggle checked={isAvailable} onChange={() => { }} disabled={isToggling} />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(product);
                      }}
                      className="!h-9 !text-xs !bg-slate-50 hover:!bg-slate-100 !border-slate-200"
                    >
                      <Pencil size={14} /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(product);
                      }}
                      className="!h-9 !text-xs !bg-rose-50 hover:!bg-rose-100 !text-rose-600 !border-rose-200"
                    >
                      <Trash2 size={14} /> Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
        <Typography variant="small">
          Showing {filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
        </Typography>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="!w-8 !h-8 !p-0 !bg-white"
            >
              <ChevronLeft size={16} />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={`!w-8 !h-8 !p-0 font-semibold ${currentPage !== page ? "!bg-white" : ""}`}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="!w-8 !h-8 !p-0 !bg-white"
            >
              <ChevronRight size={16} />
            </Button>
          </div>

          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs font-medium text-slate-700 shadow-sm focus:outline-none focus:border-[#1A4D2E] focus:ring-2 focus:ring-[#1A4D2E]/20"
          >
            <option value={8}>8 per page</option>
            <option value={12}>12 per page</option>
            <option value={16}>16 per page</option>
          </select>
        </div>
      </div>

      <ProductDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} product={selectedProduct} />
      <DeleteProductModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDelete={confirmDelete}
        deleting={deleting}
        product={selectedProduct}
      />
    </motion.div>
  );
}