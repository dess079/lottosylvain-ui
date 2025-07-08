#!/bin/bash

# Script pour corriger tous les imports dans les composants shadcn/ui
for file in /Users/sd/dev/lotterie/lottosylvain-ui/src/components/shadcn/ui/*.tsx; do
  # Remplacer import { cn } from "src/lib/utils"; par import { cn } from "../../../lib/utils";
  sed -i '' 's|import { cn } from "src/lib/utils";|import { cn } from "../../../lib/utils";|g' "$file"
  
  # Remplacer les autres imports src/components/ par ../../
  sed -i '' 's|from "src/components/|from "../../|g' "$file"
done

echo "Imports corrigés dans tous les fichiers shadcn/ui."
