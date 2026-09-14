from django.contrib import admin
from .models import TestModel

admin.site.register(TestModel)
class TestModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'width', 'height', 'depth', 'position_x', 'position_y', 'position_z',)