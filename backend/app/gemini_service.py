import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configurar la API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def generate_blog_post(prompt: str) -> dict:
    """
    Genera un post de blog completo usando Gemini AI
    Retorna un diccionario con título, contenido y palabras clave SEO
    """
    try:
        # Usar el modelo Gemini Pro
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Prompt para generar el blog post
        full_prompt = f"""
        Eres un escritor de blogs profesional. Genera un post de blog completo en español basado en el siguiente prompt: "{prompt}"

        El post debe tener:
        - Un título atractivo y relevante
        - Contenido bien estructurado con al menos 3 párrafos
        - Palabras clave SEO relevantes separadas por comas

        Formato de respuesta:
        Título: [el título aquí]
        Contenido: [el contenido aquí]
        SEO: [palabras clave separadas por comas]
        """
        
        response = model.generate_content(full_prompt)
        text = response.text.strip()
        
        # Parsear la respuesta
        lines = text.split('\n')
        title = ""
        content = ""
        seo_keywords = ""
        
        current_section = None
        for line in lines:
            line = line.strip()
            if line.startswith('Título:'):
                current_section = 'title'
                title = line.replace('Título:', '').strip()
            elif line.startswith('Contenido:'):
                current_section = 'content'
                content = line.replace('Contenido:', '').strip()
            elif line.startswith('SEO:'):
                current_section = 'seo'
                seo_keywords = line.replace('SEO:', '').strip()
            elif current_section == 'content' and line:
                content += '\n' + line
            elif current_section == 'seo' and line:
                seo_keywords += ', ' + line
        
        # Si no se pudo parsear, usar valores por defecto
        if not title:
            title = f"Post generado: {prompt[:50]}..."
        if not content:
            content = f"Este es un post generado sobre: {prompt}"
        if not seo_keywords:
            seo_keywords = "blog, IA, contenido generado"
        
        return {
            "title": title,
            "content": content,
            "seo_keywords": seo_keywords
        }
        
    except Exception as e:
        # En caso de error, retornar un post por defecto
        return {
            "title": f"Post sobre: {prompt}",
            "content": f"Error al generar el contenido: {str(e)}. Este es un post placeholder sobre: {prompt}",
            "seo_keywords": "error, placeholder"
        }