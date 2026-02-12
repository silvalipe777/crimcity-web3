import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { PlayerService } from '../services/player.service';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    const player = await PlayerService.getPlayer(req.playerId!);
    res.json({ success: true, data: player });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    res.status(400).json({ success: false, error: message });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const player = await PlayerService.getPublicProfile(req.params.id);
    res.json({ success: true, data: player });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    res.status(400).json({ success: false, error: message });
  }
});

const updateSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  avatarUrl: z.string().url().optional(),
});

router.put('/me', async (req: AuthRequest, res: Response) => {
  try {
    const data = updateSchema.parse(req.body);
    const player = await PlayerService.updateProfile(req.playerId!, data);
    res.json({ success: true, data: player });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    res.status(400).json({ success: false, error: message });
  }
});

router.get('/me/inventory', async (req: AuthRequest, res: Response) => {
  try {
    const inventory = await PlayerService.getInventory(req.playerId!);
    res.json({ success: true, data: inventory });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    res.status(400).json({ success: false, error: message });
  }
});

router.get('/me/drugs', async (req: AuthRequest, res: Response) => {
  try {
    const drugs = await PlayerService.getDrugInventory(req.playerId!);
    res.json({ success: true, data: drugs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    res.status(400).json({ success: false, error: message });
  }
});

router.get('/me/notifications', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const result = await PlayerService.getNotifications(req.playerId!, page);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    res.status(400).json({ success: false, error: message });
  }
});

router.put('/me/notifications/read', async (req: AuthRequest, res: Response) => {
  try {
    await PlayerService.markNotificationsRead(req.playerId!);
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    res.status(400).json({ success: false, error: message });
  }
});

export default router;
