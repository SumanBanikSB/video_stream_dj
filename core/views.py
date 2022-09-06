from django.shortcuts import render
from pathlib import Path


# BASE_DIR = Path(__file__).resolve().parent.parent

# Create your views here.
def home(request):
    return render(request, 'chatroom.html')

def lobby(request):
    return render(request, 'lobby.html')