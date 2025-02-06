# Conventions et Architecture du Projet

## Structure du Projet
Le projet suit une architecture Feature-Folder (également appelée Feature-First), où chaque fonctionnalité est isolée dans son propre dossier.

### Organisation d'une Feature
Exemple avec la feature `budget` :

```
src/features/budget/
├── application/           # Logique applicative et hooks
│   ├── types/            # Types DTO
│   └── viewModels/       # Hooks de vue
├── domain/               # Modèles et logique métier
├── infrastructure/       # Communication externe et état
│   ├── api/             # Appels API
│   └── store/           # Gestion d'état
└── ui/                  # Composants React
```

## Conventions de Code

### Types et Interfaces
- Utiliser des interfaces pour les modèles de domaine
- Utiliser des types pour les DTOs (Data Transfer Objects)
- Suffixer les DTOs avec `Dto`

```typescript
// Domain Model
interface Transaction {
  id: string;
  name: string;
  amount: number;
  created: Date;
  category: Category;
}

// DTO
type TransactionDto = {
  id: string;
  name: string;
  amount: number;
  created: Date;
  category: CategoryDto;
};
```

### Gestion d'État
- Utiliser Zustand pour la gestion d'état global
- Créer des stores par feature
- Nommer les stores avec le pattern `use[Feature]Store`

```typescript
interface TransactionStore {
  transactions: TransactionDto[];
  loading: boolean;
  error: Error | null;
  fetchTransactions: () => Promise<void>;
  // ... autres actions
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  // ... implémentation
}));
```

### Communication API
- Regrouper les appels API dans des fichiers dédiés (`*Api.ts`)
- Utiliser des fonctions async/await
- Gérer les erreurs de manière consistante

```typescript
const transactionApi = {
  fetchTransactions: async () => {
    const response = await fetch(`${BASE_URL}/transactions`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  },
  // ... autres méthodes
};
```

### ViewModels (Hooks personnalisés)
- Préfixer les hooks avec `use`
- Suffixer les hooks de vue avec `ViewModel`
- Isoler la logique de vue des composants

```typescript
export const useTransactionListViewModel = () => {
  const { transactions, loading, error } = useTransactionStore();
  // ... logique supplémentaire
  return { transactions, loading, error };
};
```

### Tests
- Utiliser MSW (Mock Service Worker) pour mocker les appels API
- Organiser les mocks par feature
- Maintenir des données de test réalistes

```typescript
export const handlers = [
  http.get('/api/transactions', () => {
    return HttpResponse.json(transactions);
  }),
];
```

## Bonnes Pratiques

1. **Séparation des Responsabilités**
   - La logique métier reste dans le dossier `domain`
   - La communication avec l'extérieur dans `infrastructure`
   - La logique de présentation dans `application`
   - L'interface utilisateur dans `ui`

2. **Type Safety**
   - Utiliser TypeScript strictement
   - Éviter `any`
   - Définir des types explicites pour les props des composants

3. **Gestion d'État**
   - Utiliser Zustand pour l'état global
   - Utiliser les hooks React pour l'état local
   - Éviter la prop drilling

4. **Performance**
   - Utiliser React.memo quand nécessaire
   - Optimiser les re-renders avec useMemo et useCallback
   - Implémenter le code splitting par feature

5. **Maintenance**
   - Documenter les interfaces publiques
   - Maintenir une cohérence dans le nommage
   - Suivre le principe DRY (Don't Repeat Yourself)
```

Cette documentation :
1. Décrit la structure du projet
2. Fournit des exemples concrets basés sur la feature budget
3. Établit des conventions claires pour le code
4. Liste les bonnes pratiques à suivre

Voulez-vous que je développe certaines parties en particulier ?
