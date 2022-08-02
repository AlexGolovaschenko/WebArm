from django.http import HttpResponse

def home_page_view(request):
    responce = HttpResponse()
    responce.write("<h1>CI Cloud Engine</h1>")
    responce.write("<p>Go to <a href='http://ci-cloud.online'>CI Cloud website</a> for start using</p>")
    return responce