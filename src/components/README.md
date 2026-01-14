# Composants Glassmorphisme

## Utilisation des Composants

### ThemeToggle
Bouton pour basculer entre le mode clair et sombre.

```jsx
import ThemeToggle from './components/ThemeToggle/ThemeToggle';

<ThemeToggle />
```

### GlassCard
Carte avec effet glassmorphisme.

```jsx
import GlassCard from './components/GlassCard/GlassCard';

<GlassCard variant="default">
  <h2>Contenu de la carte</h2>
</GlassCard>

// Variantes disponibles :
// - default
// - gold (avec accent doré)
// - interactive (cursor pointer)
// - compact, spacious (padding)
// - rounded-sm, rounded-md, rounded-lg, rounded-xl, rounded-full
```

### GlassInput
Champ de saisie avec effet glassmorphisme.

```jsx
import GlassInput from './components/GlassInput/GlassInput';

<GlassInput
  label="Nom"
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Entrez votre nom"
  required
  error={errorMessage}
/>
```

### GlassButton
Bouton avec effet glassmorphisme.

```jsx
import GlassButton from './components/GlassButton/GlassButton';
import { FaDownload } from 'react-icons/fa';

<GlassButton
  variant="primary" // primary, secondary, outline, ghost
  size="md" // sm, md, lg
  onClick={handleClick}
  icon={<FaDownload />}
  iconPosition="left" // left, right
>
  Télécharger
</GlassButton>
```

## Variables CSS Disponibles

Toutes les variables CSS sont disponibles via les attributs `data-theme` :

- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- `--accent-gold`, `--accent-gold-light`, `--accent-gold-dark`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--glass-bg`, `--glass-border`, `--glass-shadow`
- `--border-radius-*`
- `--spacing-*`
- `--transition-*`
