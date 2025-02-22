router.post('/:id/allot-players', authMiddleware, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    // Your player allotment logic here
    res.json({ message: 'Players allotted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 