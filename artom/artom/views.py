from django.http import JsonResponse
from .models import TestModel
from django.shortcuts import render, redirect, get_object_or_404

def index(request):
    if request.method == "POST":

        name = request.POST.get("name")
        width = request.POST.get("width")
        height = request.POST.get("height")
        depth = request.POST.get("depth")

        position_x = request.POST.get("position_x")
        position_y = request.POST.get("position_y")
        position_z = request.POST.get("position_z")

        TestModel.objects.create(
            name=name,
            width=float(width),
            height=float(height),
            depth=float(depth),
            position_x=float(position_x),
            position_y=float(position_y),
            position_z=float(position_z),
        )

        return redirect("index")
    models = TestModel.objects.all()

    return render(
        request,
        "index.html",
        {
            "models": models
        }
    )

def delete_model(request, model_id):

    if request.method == "POST":

        model = get_object_or_404(
            TestModel,
            id=model_id
        )

        model.delete()

        return JsonResponse({
            "success": True,
            "id": model_id
        })

    return JsonResponse(
        {
            "success": False,
            "message": "POST 요청만 허용됩니다."
        },
        status=405
    )

def model_list_api(request):
    boxes = TestModel.objects.all()

    data = []

    for box in boxes:
        data.append({
            'id': box.id,
            'name': box.name,
            'width': box.width,
            'height': box.height,
            'depth': box.depth,
            'position': {
                'x': box.position_x,
                'y': box.position_y,
                'z': box.position_z,
            }
        })
    return JsonResponse({
        'models': data,
    })