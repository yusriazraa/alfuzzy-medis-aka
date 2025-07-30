// frontend/src/app/dashboard/admin/rules/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { DiseaseRule } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pencil, PlusCircle } from 'lucide-react';

// API calls
const api = {
    getRules: async (): Promise<DiseaseRule[]> => {
        const res = await fetch('http://localhost:5000/api/admin/rules');
        return res.json();
    },
    updateRule: async (id: number, data: Partial<DiseaseRule>): Promise<DiseaseRule> => {
        const res = await fetch(`http://localhost:5000/api/admin/rules/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },
    addRule: async (data: Omit<DiseaseRule, 'id'>): Promise<DiseaseRule> => {
        const res = await fetch('http://localhost:5000/api/admin/rules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    }
};

const RuleDialog = ({ rule, onSave, onClose }: { rule: Partial<DiseaseRule>, onSave: (data: Partial<DiseaseRule>) => void, onClose: () => void }) => {
    const [formData, setFormData] = useState(rule);

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{rule.id ? 'Edit Rule' : 'Tambah Rule Baru'}</DialogTitle>
                <DialogDescription>
                    Atur nama penyakit, gejala, dan tingkat keparahan. Perubahan akan langsung aktif pada sistem diagnosis.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Penyakit</Label>
                    <Input id="name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="symptoms">Gejala (pisahkan dengan koma)</Label>
                    <Input id="symptoms" value={(formData.symptoms || []).join(', ')} onChange={(e) => setFormData({ ...formData, symptoms: e.target.value.split(',').map(s => s.trim()) })} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="severity">Tingkat Keparahan</Label>
                    <Select value={formData.severity} onValueChange={(value: 'ringan' | 'sedang' | 'berat') => setFormData({ ...formData, severity: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih tingkat keparahan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ringan">Ringan</SelectItem>
                            <SelectItem value="sedang">Sedang</SelectItem>
                            <SelectItem value="berat">Berat</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Batal</Button>
                <Button onClick={handleSave}>Simpan</Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default function RulesPage() {
    const [rules, setRules] = useState<DiseaseRule[]>([]);
    const [selectedRule, setSelectedRule] = useState<Partial<DiseaseRule> | null>(null);

    const fetchRules = () => {
        api.getRules().then(setRules);
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleSave = async (data: Partial<DiseaseRule>) => {
        if (data.id) { // Update
            await api.updateRule(data.id, data);
        } else { // Create
            await api.addRule(data as Omit<DiseaseRule, 'id'>);
        }
        fetchRules();
        setSelectedRule(null);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manajemen Rules Fuzzy</CardTitle>
                    <CardDescription>Kelola aturan penyakit untuk sistem diagnosis.</CardDescription>
                </div>
                <Button onClick={() => setSelectedRule({ name: '', symptoms: [], severity: 'ringan' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Rule
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Penyakit</TableHead>
                            <TableHead>Gejala</TableHead>
                            <TableHead>Keparahan</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rules.map((rule) => (
                            <TableRow key={rule.id}>
                                <TableCell className="font-medium">{rule.name}</TableCell>
                                <TableCell className="max-w-md">
                                    <div className="flex flex-wrap gap-1">
                                        {rule.symptoms.map((s: string) => <Badge key={s} variant="outline">{s}</Badge>)}
                                    </div>
                                </TableCell>
                                <TableCell><Badge variant={rule.severity === 'berat' ? 'destructive' : 'secondary'}>{rule.severity}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedRule(rule)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <Dialog open={!!selectedRule} onOpenChange={(open) => { if (!open) setSelectedRule(null); }}>
                {selectedRule && <RuleDialog rule={selectedRule} onSave={handleSave} onClose={() => setSelectedRule(null)} />}
            </Dialog>
        </Card>
    );
}
