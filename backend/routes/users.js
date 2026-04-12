// ── Get my profile — works for both admin and user ──
router.get("/me", protectUser, async (req, res) => {
  // Admin
  if (req.user.role === "admin") {
    return res.json({
      id: req.user._id,
      email: req.user.email,
      firstName: "Admin",
      lastName: "",
      role: "admin",
    });
  }
  // Regular user
  res.json({
    id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    phone: req.user.phone,
    role: "user",
  });
});
