#!/bin/bash

# Script para acelerar indexación en Google
# Uso: bash submit-to-google.sh https://tu-sitio.netlify.app

SITE_URL="${1:-https://tu-retrotube.netlify.app}"

echo "🚀 Submeter sitio a Google"
echo "Sitio: $SITE_URL"
echo ""

# 1. Verificar que el sitio está en vivo
echo "1️⃣ Verificando que el sitio está en línea..."
if curl -s -o /dev/null -w "%{http_code}" "$SITE_URL" | grep -q "200\|301"; then
    echo "✅ Sitio está en línea"
else
    echo "❌ Sitio no responde. Verifica la URL."
    exit 1
fi

# 2. Verificar robots.txt
echo ""
echo "2️⃣ Verificando robots.txt..."
if curl -s "$SITE_URL/robots.txt" | grep -q "Sitemap"; then
    echo "✅ robots.txt está configurado"
else
    echo "⚠️ robots.txt podría mejorase"
fi

# 3. Verificar sitemap.xml
echo ""
echo "3️⃣ Verificando sitemap.xml..."
if curl -s "$SITE_URL/sitemap.xml" | grep -q "urlset"; then
    echo "✅ sitemap.xml está presente"
else
    echo "❌ sitemap.xml no encontrado"
fi

# 4. Verificar meta tags
echo ""
echo "4️⃣ Verificando meta tags SEO..."
RESPONSE=$(curl -s "$SITE_URL")
if echo "$RESPONSE" | grep -q "og:title"; then
    echo "✅ Open Graph tags presente"
fi
if echo "$RESPONSE" | grep -q "name=\"description\""; then
    echo "✅ Meta description presente"
fi
if echo "$RESPONSE" | grep -q "name=\"keywords\""; then
    echo "✅ Keywords presente"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📋 SIGUIENTES PASOS (OBLIGATORIO):"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "1. Ve a: https://search.google.com/search-console"
echo "2. Haz clic en 'Añadir propiedad'"
echo "3. Pega esta URL: $SITE_URL"
echo "4. Verifica el sitio (recomendado: meta tag)"
echo "5. Una vez verificado:"
echo "   - Ve a 'Sitemaps'"
echo "   - Añade: $SITE_URL/sitemap.xml"
echo "   - Haz clic en 'Solicitar indexación'"
echo ""
echo "⏱️ Google indexará en 1-3 horas"
echo ""
