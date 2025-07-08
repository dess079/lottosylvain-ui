#!/bin/bash

# Script pour corriger tous les imports dans les composants shadcn/ui
for file in /Users/sd/dev/lotterie/lottosylvain-ui/src/components/shadcn/ui/*.tsx; do
  echo "Correcting imports in $file"
  
  # Remplacer import { cn } from "src/lib/utils" par import { cn } from "../../../lib/utils"
  sed -i '' 's|import { cn } from "src/lib/utils"|import { cn } from "../../../lib/utils"|g' "$file"
  
  # Remplacer import { X } from "src/components/shadcn/ui/X" par import { X } from "./X"
  sed -i '' 's|import { .* } from "src/components/shadcn/ui/\([^"]*\)"|import { & } from "./\1"|g' "$file"
  
  # Corriger les imports qui n'utilisent pas le modèle précédent
  sed -i '' 's|from "src/components/shadcn/ui/|from "./|g' "$file"
  
  # Corriger les imports plus génériques qui font référence à d'autres composants shadcn
  sed -i '' 's|from "../../shadcn/ui/|from "./|g' "$file"
done

echo "Imports corrigés dans tous les fichiers shadcn/ui."
