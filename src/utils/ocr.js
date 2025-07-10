import * as FileSystem from 'expo-file-system';
import { MINDEE_API_KEY } from '@env';

const mindeeApiKey = MINDEE_API_KEY;

function formatPrediction(prediction) {
  if (!prediction) return null;

  const currency = prediction.locale?.currency || null;
  const confidences = [];

  const formatField = (field) => {
    if (!field) return null;
    if (typeof field.confidence === 'number') confidences.push(field.confidence);
    return field.value ?? null;
  };

  const formatNumber = (num) => {
    if (typeof num === 'number') return num === 0 ? null : num;
    return null;
  };

  const rawLineItems = prediction.line_items || [];
  const lineItems = rawLineItems.map((item) => {
    const quantity = formatNumber(item.quantity);
    let unitPrice = formatNumber(item.unit_price);
    let totalAmount = formatNumber(item.total_amount);

    if (currency === 'VND') {
      if (unitPrice !== null && unitPrice < 1000) unitPrice *= 1000;
      if (totalAmount !== null && totalAmount < 1000) totalAmount *= 1000;
    }

    if (typeof item.confidence === 'number') confidences.push(item.confidence);

    return {
      description: item.description || null,
      quantity,
      unitPrice,
      totalAmount,
    };
  });

  const lineItemTotal = lineItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);

  let totalAmount = formatNumber(prediction.total_amount?.value);
  if (currency === 'VND' && totalAmount !== null && totalAmount < 1000) {
    totalAmount *= 1000;
  }

  // 🔥 Nếu lệch thì báo lỗi
  if (totalAmount !== null && Math.abs(lineItemTotal - totalAmount) > 1) {
    throw new Error(
      `❌ Tổng tiền từ dòng (${lineItemTotal}) khác với tổng tiền OCR (${totalAmount})`
    );
  }

  const avgConfidence =
    confidences.length > 0
      ? Number((confidences.reduce((a, b) => a + b, 0) / confidences.length).toFixed(2))
      : null;

  return {
    category: formatField(prediction.category),
    subcategory: formatField(prediction.subcategory),
    documentType: formatField(prediction.document_type),
    date: formatField(prediction.date),
    time: formatField(prediction.time),
    locale: currency,
    supplier: {
      name: formatField(prediction.supplier_name),
      phone: formatField(prediction.supplier_phone_number),
      address: formatField(prediction.supplier_address),
    },
    receiptNumber: formatField(prediction.receipt_number),
    totalAmount,
    totalNet: formatNumber(prediction.total_net?.value),
    totalTax: formatNumber(prediction.total_tax?.value),
    tip: formatNumber(prediction.tip?.value),
    lineItems,
    avgConfidence,
  };
}

export const sendToMindee = async (fileUri) => {
  try {
    const formData = new FormData();
    formData.append('document', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'receipt.jpg',
    });

    const response = await fetch(
      'https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict',
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${mindeeApiKey}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`🛑 Mindee API Error: ${response.status} - ${errorText}`);
    }

    const json = await response.json();
    const prediction = json.document?.inference?.prediction;

    return formatPrediction(prediction);
  } catch (error) {
    console.error('❌ OCR Error:', error.message || error);
    throw error;
  }
};
