#include <stdio.h>
#include <stdlib.h>
#define N 10


void testFunction(int par1);

int main(int argc, char const *argv[])
{
	
	int testVariable = 5;
	printf("%d", testVariable);
	return 0;
}

void testFunction(int par1){

	printf("%d", par1);
}