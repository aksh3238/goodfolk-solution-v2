    });
    return res.status(201).json({ success: true, section: created });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create section' });
  }
});

app.put('/api/admin/sections/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateCustomSection(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Section not found' });
    return res.json({ success: true, section: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update section' });
  }
});

app.post('/api/admin/sections/:id/duplicate', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const duplicated = db.duplicateCustomSection(id);
    if (!duplicated) return res.status(404).json({ error: 'Section not found' });
    return res.status(201).json({ success: true, section: duplicated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to duplicate section' });
  }
});

app.delete('/api/admin/sections/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteCustomSection(id);
    if (!deleted) return res.status(404).json({ error: 'Section not found' });
    return res.json({ success: true, message: 'Section removed successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete section' });
  }
});

app.post('/api/admin/sections/reorder', requireAdmin, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds required' });
    const reordered = db.reorderCustomSections(orderedIds);
    return res.json({ success: true, sections: reordered });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reorder sections' });
  }
});

// 9. Service Concepts CMS APIs (Available for EVERY Service)
app.get('/api/admin/concepts', requireAdmin, (req, res) => {
  try {
    const { serviceId } = req.query;
    const concepts = db.getServiceConcepts(serviceId as string, false);
    return res.json({ success: true, concepts });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load concepts' });
  }
});

app.post('/api/admin/concepts', requireAdmin, (req, res) => {
  try {
    const { serviceId, title, category, tagline, description, image, deliverables, clientName, published, featured } = req.body;
    if (!serviceId || !title || !image) {
      return res.status(400).json({ error: 'Service, title, and image are required.' });
    }
    const created = db.addServiceConcept({
      serviceId: serviceId.trim().toLowerCase(),
      title: title.trim(),
      category: category || serviceId,
      tagline: (tagline || '').trim(),
      description: (description || '').trim(),
      image: image.trim(),
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      clientName: (clientName || '').trim(),
      order: 0,
      published: published !== undefined ? Boolean(published) : true,
      featured: Boolean(featured)
    });
    return res.status(201).json({ success: true, concept: created });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create concept' });
  }
});

app.put('/api/admin/concepts/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateServiceConcept(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Concept not found' });
    return res.json({ success: true, concept: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update concept' });
  }
});

app.post('/api/admin/concepts/:id/duplicate', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const duplicated = db.duplicateServiceConcept(id);
    if (!duplicated) return res.status(404).json({ error: 'Concept not found' });
    return res.status(201).json({ success: true, concept: duplicated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to duplicate concept' });
  }
});

app.delete('/api/admin/concepts/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteServiceConcept(id);
    if (!deleted) return res.status(404).json({ error: 'Concept not found' });
    return res.json({ success: true, message: 'Concept removed' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete concept' });
  }
});

app.post('/api/admin/concepts/reorder', requireAdmin, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds required' });
    const reordered = db.reorderServiceConcepts(orderedIds);
    return res.json({ success: true, concepts: reordered });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reorder concepts' });
