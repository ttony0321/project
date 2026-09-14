from django.db import models

class TestModel(models.Model):
    #NEEDS name, width, height, depth, position_x,y,z
    name = models.CharField(max_length=200)

    width = models.FloatField(default=2.0)
    height = models.FloatField(default=2.0)
    depth = models.FloatField(default=2.0)

    position_x = models.FloatField(default=2.0)
    position_y = models.FloatField(default=2.0)
    position_z = models.FloatField(default=2.0)

    def __str__(self):
        return self.name