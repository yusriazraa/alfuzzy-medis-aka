// frontend/src/app/dashboard/admin/rules/page.tsx
'use client';

import { useEffect, useState } from 'react';
// FIX: Mengimpor DiseaseRule dari @/types, bukan @/database
import { DiseaseRule } from '@/types'; 
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Pencil } from 'lucide-react';

// Mock API call
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
    }
};

export default function RulesPage() {
    const [rules, setRules] = useState<DiseaseRule[]>([]);
    const [selectedRule, setSelectedRule] = useState<DiseaseRule | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        api.getRules().then(setRules);
    }, []);

    const handleSave = async () => {
        if (!selectedRule) return;
        const updatedRule = await api.updateRule(selectedRule.id, {
            name: selectedRule.name,
            symptoms: selectedRule.symptoms,
        });
        setRules(rules.map(r => r.id === updatedRule.id ? updatedRule : r));
        setIsDialogOpen(false);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Manajemen Rules Fuzzy</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama Penyakit</TableHead>
                        <TableHead>Gejala Terkait</TableHead>
                        <TableHead>Tingkat Keparahan</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rules.map((rule) => (
                        <TableRow key={rule.id}>
                            <TableCell className="font-medium">{rule.name}</TableCell>
                            <TableCell className="max-w-xs">
                                <div className="flex flex-wrap gap-1">
                                    {/* FIX: Menambahkan tipe 'string' untuk parameter 's' */}
                                    {rule.symptoms.map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}
                                </div>
                            </TableCell>
                            <TableCell>{rule.severity}</TableCell>
                            <TableCell>
                                <Dialog open={isDialogOpen && selectedRule?.id === rule.id} onOpenChange={(open) => { if (!open) setSelectedRule(null); setIsDialogOpen(open); }}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="icon" onClick={() => { setSelectedRule(rule); setIsDialogOpen(true); }}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Rule: {selectedRule?.name}</DialogTitle>
                                            <DialogDescription>Ubah nama atau gejala yang terkait dengan penyakit ini. Perubahan akan langsung aktif.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Nama Penyakit</Label>
                                                {/* FIX: Menambahkan tipe 'DiseaseRule | null' untuk parameter 'prev' */}
                                                <Input id="name" value={selectedRule?.name} onChange={(e) => setSelectedRule((prev: DiseaseRule | null) => prev ? { ...prev, name: e.target.value } : null)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="symptoms">Gejala (pisahkan dengan koma)</Label>
                                                {/* FIX: Menambahkan tipe 'DiseaseRule | null' untuk parameter 'prev' */}
                                                <Input id="symptoms" value={selectedRule?.symptoms.join(', ')} onChange={(e) => setSelectedRule((prev: DiseaseRule | null) => prev ? { ...prev, symptoms: e.target.value.split(',').map(s => s.trim()) } : null)} />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                                            <Button onClick={handleSave}>Simpan Perubahan</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
