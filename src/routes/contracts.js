import express from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

let contracts = [];
let logs = [];

// إنشاء عقد
router.post("/", authMiddleware, (req, res) => {
  const contract = {
    id: Date.now(),
    ...req.body,
    status: "draft",
    created_at: new Date(),
    updated_at: new Date()
  };

  contracts.push(contract);

  res.json(contract);
});

// جلب كل العقود مع فلترة
router.get("/", authMiddleware, (req, res) => {
  const { status, seller_name, buyer_name, type } = req.query;

  let result = [...contracts];

  if (status) {
    result = result.filter((c) => c.status === status);
  }

  if (seller_name) {
    result = result.filter((c) =>
      c.seller_name?.includes(seller_name)
    );
  }

  if (buyer_name) {
    result = result.filter((c) =>
      c.buyer_name?.includes(buyer_name)
    );
  }

  if (type) {
    result = result.filter((c) => c.type === type);
  }

  res.json(result);
});

// جلب عقد واحد
router.get("/:id", authMiddleware, (req, res) => {
  const contract = contracts.find((c) => c.id == req.params.id);

  if (!contract) {
    return res.status(404).send("العقد غير موجود");
  }

  res.json(contract);
});

// تأكيد عقد
router.put("/:id/confirm", authMiddleware, (req, res) => {
  const contract = contracts.find((c) => c.id == req.params.id);

  if (!contract) {
    return res.status(404).send("العقد غير موجود");
  }

  const oldStatus = contract.status;
  contract.status = "confirmed";
  contract.updated_at = new Date();

  logs.push({
    id: Date.now(),
    contract_id: contract.id,
    action: "status_changed",
    from_value: oldStatus,
    to_value: "confirmed",
    created_at: new Date()
  });

  res.json(contract);
});

// إرجاع العقد إلى مسودة
router.put("/:id/revert", authMiddleware, (req, res) => {
  const contract = contracts.find((c) => c.id == req.params.id);

  if (!contract) {
    return res.status(404).send("العقد غير موجود");
  }

  const oldStatus = contract.status;
  contract.status = "draft";
  contract.updated_at = new Date();

  logs.push({
    id: Date.now(),
    contract_id: contract.id,
    action: "status_changed",
    from_value: oldStatus,
    to_value: "draft",
    created_at: new Date()
  });

  res.json(contract);
});

// تعديل عقد
router.put("/:id", authMiddleware, (req, res) => {
  const contract = contracts.find((c) => c.id == req.params.id);

  if (!contract) {
    return res.status(404).send("العقد غير موجود");
  }

  const oldSeller = contract.seller_name;
  const oldBuyer = contract.buyer_name;

  contract.seller_name = req.body.seller_name ?? contract.seller_name;
  contract.buyer_name = req.body.buyer_name ?? contract.buyer_name;
  contract.type = req.body.type ?? contract.type;
  contract.updated_at = new Date();

  if (oldSeller !== contract.seller_name) {
    logs.push({
      id: Date.now() + 1,
      contract_id: contract.id,
      action: "seller_name_updated",
      from_value: oldSeller || "",
      to_value: contract.seller_name || "",
      created_at: new Date()
    });
  }

  if (oldBuyer !== contract.buyer_name) {
    logs.push({
      id: Date.now() + 2,
      contract_id: contract.id,
      action: "buyer_name_updated",
      from_value: oldBuyer || "",
      to_value: contract.buyer_name || "",
      created_at: new Date()
    });
  }

  res.json(contract);
});

// سجل التعديلات لعقد واحد
router.get("/:id/logs", authMiddleware, (req, res) => {
  const contractLogs = logs.filter((log) => log.contract_id == req.params.id);
  res.json(contractLogs);
});

export default router;